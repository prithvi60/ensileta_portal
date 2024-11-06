"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import { ADD_MB_FILENAME, CREATE_MARKER_GROUP_MB, GET_ALL_MB_VIEW, GET_MARKER_GROUP_BY_ID_MB, GET_USERS } from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";

interface GetAllMBViewResponse {
    getAllMBFiles: Array<{
        id: number;
        filename: string;
        fileUrl: string;
        version: number;
        userId: number;
        createdAt: string;
    }>;
}

const Page = () => {
    const [uploadFile] = useMutation(ADD_MB_FILENAME);
    const { data } = useQuery<GetAllMBViewResponse>(GET_ALL_MB_VIEW);
    const { data: AllUsers, loading, refetch } = useQuery(GET_USERS);
    const pathname = usePathname();
    const fileType = pathname.split("/").pop();
    const lastItem =
        data?.getAllMBFiles[data?.getAllMBFiles.length - 1] ||
        data?.getAllMBFiles[0] ||
        null;
    const [createMarkerGroup] = useMutation(CREATE_MARKER_GROUP_MB, {
        refetchQueries: [
            { query: GET_MARKER_GROUP_BY_ID_MB, variables: { drawingMbId: lastItem?.id } },
        ],
        awaitRefetchQueries: true,
    });
    const { data: markerMb } = useQuery(GET_MARKER_GROUP_BY_ID_MB, {
        variables: { drawingMbId: lastItem?.id },
    });

    const createData = async (markers: any) => {
        try {
            const { data } = await createMarkerGroup({
                variables: {
                    data: markers,
                    drawingMbId: lastItem?.id,
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
                        data={data?.getAllMBFiles}
                        allUsers={AllUsers}
                        uploadFile={uploadFile}
                        fileType={fileType || ""}
                        title={"Your Mood Board Drawings"}
                        refetchUsers={refetch}
                        lastItem={lastItem}
                        createMarkerGroup={createData}
                        markerData={markerMb?.getMarkerGroupByMbId?.data}
                    />
                )}
            </section>
        </DefaultLayout>
    );
};

export default Page;
