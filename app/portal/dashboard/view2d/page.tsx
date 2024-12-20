"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import {
  ADD_2D_FILENAME,
  CREATE_MARKER_GROUP_2D,
  GET_ALL_2D_VIEW,
  GET_MARKER_GROUP_BY_ID_2D,
  GET_USERS,
} from "@/lib/Queries";
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

type GetAll2DViewResponse = {
  getAll2DFiles: FileData[];
};

type MarkerGroupResponse = {
  getMarkerGroupBy2DId: {
    data: any;
  };
};

const Page: React.FC = () => {
  const pathname = usePathname();
  const fileType = pathname.split("/").pop() || "";
  const { data, loading: filesLoading } = useQuery<GetAll2DViewResponse>(GET_ALL_2D_VIEW);
  const { data: AllUsers, refetch } = useQuery(GET_USERS);
  const [uploadFile] = useMutation(ADD_2D_FILENAME);

  // ID
  const lastItem =
    data?.getAll2DFiles[data?.getAll2DFiles.length - 1] ||
    data?.getAll2DFiles[0] ||
    null;

  // Mutation
  const [createMarkerGroup] = useMutation(CREATE_MARKER_GROUP_2D, {
    refetchQueries: [
      { query: GET_MARKER_GROUP_BY_ID_2D, variables: { drawing2DId: lastItem?.id } },
    ],
    awaitRefetchQueries: true,
  });

  // Query
  const { data: marker2d } = useQuery<MarkerGroupResponse>(GET_MARKER_GROUP_BY_ID_2D, {
    variables: { drawing2DId: lastItem?.id },
    skip: !lastItem?.id,
  });

  const handleCreateMarkerGroup = async (markers: any): Promise<void> => {
    if (!lastItem?.id) return;

    try {
      await createMarkerGroup({
        variables: {
          data: markers,
          drawing2DId: lastItem.id,
        },
      });
    } catch (error) {
      console.error("Error creating marker group:", error);
    }
  };

  return (
    <DefaultLayout>
      {filesLoading ? (
        <Loader />
      ) : (
        <section className="h-full w-full">
          <GetAll2dView
            data={data?.getAll2DFiles}
            allUsers={AllUsers}
            uploadFile={uploadFile}
            fileType={fileType || ""}
            title={"Your 2D Drawings"}
            approveType={"DRAWING_2D"}
            refetchUsers={refetch}
            lastItem={lastItem}
            createMarkerGroup={handleCreateMarkerGroup}
            markerData={marker2d?.getMarkerGroupBy2DId?.data}
          />
        </section>
      )}
    </DefaultLayout>
  );
};

export default Page;
