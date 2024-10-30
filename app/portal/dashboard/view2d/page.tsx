"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import {
  ADD_2D_FILENAME,
  CREATE_MARKER_GROUP_2D,
  GET_ALL_2D_VIEW,
  GET_MARKER_GROUP_BY_ID_2D,
  GET_USER,
  GET_USERS,
} from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";

interface GetAll2DViewResponse {
  getAll2DFiles: Array<{
    id: number;
    filename: string;
    fileUrl: string;
    version: number;
    userId: number;
    createdAt: string;
  }>;
}

const Page = () => {
  const [uploadFile] = useMutation(ADD_2D_FILENAME);
  const { data } = useQuery<GetAll2DViewResponse>(GET_ALL_2D_VIEW);
  const { data: AllUsers, loading, refetch } = useQuery(GET_USERS);
  const pathname = usePathname();
  const fileType = pathname.split("/").pop();
  const { data: RoleBased } = useQuery(GET_USER);
  const userId = RoleBased?.user?.id;

  // ID
  const lastItem =
    data?.getAll2DFiles[data?.getAll2DFiles.length - 1] ||
    data?.getAll2DFiles[0] ||
    null;

  // Mutation
  const [createMarkerGroup] = useMutation(CREATE_MARKER_GROUP_2D, {
    refetchQueries: [
      { query: GET_MARKER_GROUP_BY_ID_2D, variables: { id: lastItem?.id } },
    ],
    awaitRefetchQueries: true,
  });
  // Query
  const { data: marker2d } = useQuery(GET_MARKER_GROUP_BY_ID_2D, {
    variables: { drawing2DId: lastItem?.id },
  });

  const createData = async (markers: any, id: number) => {
    try {
      const { data } = await createMarkerGroup({
        variables: {
          data: markers,
          drawing2DId: lastItem?.id,
        },
      });
      console.log("Created Marker Group:", data);
      // alert("Successfully saved!");
    } catch (error) {
      console.error("Error creating marker group:", error);
    }
  };

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <section className="h-full w-full">
          <GetAll2dView
            data={data?.getAll2DFiles}
            allUsers={AllUsers}
            uploadFile={uploadFile}
            fileType={fileType || "view2d"}
            title={"Your 2D Drawings"}
            refetchUsers={refetch}
            lastItem={lastItem}
            createMarkerGroup={createData}
            markerData={marker2d?.getMarkerGroupBy2DId?.data}
          />
        </section>
      )}
    </DefaultLayout>
  );
};

export default Page;
