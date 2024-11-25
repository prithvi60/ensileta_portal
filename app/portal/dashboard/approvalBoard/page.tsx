"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import { ADD_AB_FILENAME, CREATE_MARKER_GROUP_AB, GET_ALL_AB_VIEW, GET_MARKER_GROUP_BY_ID_AB, GET_USERS } from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";

interface GetAllABViewResponse {
    getAllABFiles: Array<{
        id: number;
        filename: string;
        fileUrl: string;
        version: number;
        userId: number;
        createdAt: string;
    }>;
}

const Page = () => {
    const [uploadFile] = useMutation(ADD_AB_FILENAME);
    const { data, loading } = useQuery<GetAllABViewResponse>(GET_ALL_AB_VIEW);
    const { data: AllUsers, refetch } = useQuery(GET_USERS);
    const pathname = usePathname();
    const fileType = pathname.split("/").pop();
    const lastItem =
        data?.getAllABFiles[data?.getAllABFiles.length - 1] ||
        data?.getAllABFiles[0] ||
        null;
    const [createMarkerGroup] = useMutation(CREATE_MARKER_GROUP_AB, {
        refetchQueries: [
            { query: GET_MARKER_GROUP_BY_ID_AB, variables: { drawingAbId: lastItem?.id } },
        ],
        awaitRefetchQueries: true,
    });
    const { data: markerAb } = useQuery(GET_MARKER_GROUP_BY_ID_AB, {
        variables: { drawingAbId: lastItem?.id },
    });

    const createData = async (markers: any) => {
        try {
            const { data } = await createMarkerGroup({
                variables: {
                    data: markers,
                    drawingAbId: lastItem?.id,
                },
            });
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
                        data={data?.getAllABFiles}
                        allUsers={AllUsers}
                        uploadFile={uploadFile}
                        fileType={fileType || ""}
                        approveType={"DRAWING_AB"}
                        title={"Your Approval Board Drawings"}
                        refetchUsers={refetch}
                        lastItem={lastItem}
                        createMarkerGroup={createData}
                        markerData={markerAb?.getMarkerGroupByAbId?.data}
                    />
                )}
            </section>
        </DefaultLayout>
    );
};

export default Page;
