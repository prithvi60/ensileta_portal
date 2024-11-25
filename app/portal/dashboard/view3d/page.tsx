"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import { ADD_3D_FILENAME, CREATE_MARKER_GROUP_3D, GET_ALL_3D_VIEW, GET_MARKER_GROUP_BY_ID_3D, GET_USERS } from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";

interface GetAll3DViewResponse {
    getAll3DFiles: Array<{
        id: number;
        filename: string;
        fileUrl: string;
        version: number;
        userId: number;
        createdAt: string;
    }>;
}

const Page = () => {
    const [uploadFile] = useMutation(ADD_3D_FILENAME);
    const { data, loading } = useQuery<GetAll3DViewResponse>(GET_ALL_3D_VIEW);
    const { data: AllUsers, refetch } = useQuery(GET_USERS);
    const pathname = usePathname();
    const fileType = pathname.split("/").pop();
    const lastItem =
        data?.getAll3DFiles[data?.getAll3DFiles.length - 1] ||
        data?.getAll3DFiles[0] ||
        null;

    const [createMarkerGroup] = useMutation(CREATE_MARKER_GROUP_3D, {
        refetchQueries: [
            { query: GET_MARKER_GROUP_BY_ID_3D, variables: { drawing3DId: lastItem?.id } },
        ],
        awaitRefetchQueries: true,
    });
    const { data: marker3d } = useQuery(GET_MARKER_GROUP_BY_ID_3D, {
        variables: { drawing3DId: lastItem?.id },
    });


    const createData = async (markers: any) => {
        try {
            const { data } = await createMarkerGroup({
                variables: {
                    data: markers,
                    drawing3DId: lastItem?.id,
                },
            });
            // console.log("Created Marker Group:", data);
            // alert("Successfully saved!");
        } catch (error) {
            console.error("Error creating marker group:", error);
        }
    };

    return (
        <DefaultLayout>
            <section className="h-full w-full">
                {loading ? (
                    <Loader />
                ) : (
                    <GetAll2dView
                        data={data?.getAll3DFiles}
                        allUsers={AllUsers}
                        uploadFile={uploadFile}
                        fileType={fileType || ""}
                        approveType={"DRAWING_3D"}
                        title={"Your 3D Drawings"}
                        refetchUsers={refetch}
                        lastItem={lastItem}
                        createMarkerGroup={createData}
                        markerData={marker3d?.getMarkerGroupBy3DId?.data}
                    />
                )}
            </section>
        </DefaultLayout>
    );
};

export default Page;
