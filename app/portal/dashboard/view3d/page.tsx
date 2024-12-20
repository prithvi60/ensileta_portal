"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import { ADD_3D_FILENAME, CREATE_MARKER_GROUP_3D, GET_ALL_3D_VIEW, GET_MARKER_GROUP_BY_ID_3D, GET_USERS } from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import React from "react";

type FileData = {
    id: number;
    filename: string;
    fileUrl: string;
    version: number;
    userId: number;
    createdAt: string;
};

interface GetAll3DViewResponse {
    getAll3DFiles: FileData[];
}

type MarkerGroupResponse = {
    getMarkerGroupBy3DId: {
        data: any;
    };
};

const Page: React.FC = () => {
    const pathname = usePathname();
    const fileType = pathname.split("/").pop() || "";
    const { data, loading: filesLoading } = useQuery<GetAll3DViewResponse>(GET_ALL_3D_VIEW);
    const { data: AllUsers, refetch } = useQuery(GET_USERS);

    const [uploadFile] = useMutation(ADD_3D_FILENAME);

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
    const { data: marker3d } = useQuery<MarkerGroupResponse>(GET_MARKER_GROUP_BY_ID_3D, {
        variables: { drawing3DId: lastItem?.id },
        skip: !lastItem?.id,
    });


    const handleCreateMarkerGroup = async (markers: any): Promise<void> => {
        if (!lastItem?.id) return;

        try {
            await createMarkerGroup({
                variables: {
                    data: markers,
                    drawing3DId: lastItem?.id,
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
                        data={data?.getAll3DFiles}
                        allUsers={AllUsers}
                        uploadFile={uploadFile}
                        fileType={fileType || ""}
                        approveType={"DRAWING_3D"}
                        title={"Your 3D Drawings"}
                        refetchUsers={refetch}
                        lastItem={lastItem}
                        createMarkerGroup={handleCreateMarkerGroup}
                        markerData={marker3d?.getMarkerGroupBy3DId?.data}
                    />
                )}
            </section>
        </DefaultLayout>
    );
};

export default Page;
