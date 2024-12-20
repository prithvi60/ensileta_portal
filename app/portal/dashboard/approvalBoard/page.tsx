"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import { ADD_AB_FILENAME, CREATE_MARKER_GROUP_AB, GET_ALL_AB_VIEW, GET_MARKER_GROUP_BY_ID_AB, GET_USERS } from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";

type FileData = {
    id: number;
    filename: string;
    fileUrl: string;
    version: number;
    userId: number;
    createdAt: string;
};

interface GetAllABViewResponse {
    getAllABFiles: FileData[];
}

type MarkerGroupResponse = {
    getMarkerGroupByAbId: {
        data: any;
    };
};

const Page = () => {
    const pathname = usePathname();
    const fileType = pathname.split("/").pop() || "";
    const { data, loading: filesLoading } = useQuery<GetAllABViewResponse>(GET_ALL_AB_VIEW);
    const { data: AllUsers, refetch } = useQuery(GET_USERS);

    const [uploadFile] = useMutation(ADD_AB_FILENAME);

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
    const { data: markerAb } = useQuery<MarkerGroupResponse>(GET_MARKER_GROUP_BY_ID_AB, {
        variables: { drawingAbId: lastItem?.id },
        skip: !lastItem?.id,
    });

    const handleCreateMarkerGroup = async (markers: any): Promise<void> => {
        if (!lastItem?.id) return;

        try {
            await createMarkerGroup({
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
                {filesLoading ? (
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
                        createMarkerGroup={handleCreateMarkerGroup}
                        markerData={markerAb?.getMarkerGroupByAbId?.data}
                    />
                )}
            </section>
        </DefaultLayout>
    );
};

export default Page;
