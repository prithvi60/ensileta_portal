"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import { ADD_BOQ_FILENAME, CREATE_MARKER_GROUP_BOQ, GET_ALL_BOQ_VIEW, GET_MARKER_GROUP_BY_ID_BOQ, GET_USERS } from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";

interface GetAllBOQViewResponse {
    getAllBOQFiles: Array<{
        id: number;
        filename: string;
        fileUrl: string;
        version: number;
        userId: number;
        createdAt: string;
    }>;
}

const Page = () => {
    const [uploadFile] = useMutation(ADD_BOQ_FILENAME);
    const { data } = useQuery<GetAllBOQViewResponse>(GET_ALL_BOQ_VIEW);
    const { data: AllUsers, loading, refetch } = useQuery(GET_USERS);
    const pathname = usePathname();
    const fileType = pathname.split("/").pop();
    const lastItem =
        data?.getAllBOQFiles[data?.getAllBOQFiles.length - 1] ||
        data?.getAllBOQFiles[0] ||
        null;
    const [createMarkerGroup] = useMutation(CREATE_MARKER_GROUP_BOQ, {
        refetchQueries: [
            { query: GET_MARKER_GROUP_BY_ID_BOQ, variables: { drawingBoqId: lastItem?.id } },
        ],
        awaitRefetchQueries: true,
    });
    const { data: markerBoq } = useQuery(GET_MARKER_GROUP_BY_ID_BOQ, {
        variables: { drawingBoqId: lastItem?.id },
    });

    const createData = async (markers: any) => {
        try {
            const { data } = await createMarkerGroup({
                variables: {
                    data: markers,
                    drawingBoqId: lastItem?.id,
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
                        data={data?.getAllBOQFiles}
                        allUsers={AllUsers}
                        uploadFile={uploadFile}
                        fileType={fileType || ""}
                        approveType={"DRAWING_BOQ"}
                        title={"Your BOQ Drawings"}
                        refetchUsers={refetch}
                        lastItem={lastItem}
                        createMarkerGroup={createData}
                        markerData={markerBoq?.getMarkerGroupByBoqId?.data}
                    />
                )}
            </section>
        </DefaultLayout>
    );
};

export default Page;
