"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import {
  ADD_2D_FILENAME,
  ADD_MARKERS,
  GET_ALL_2D_VIEW,
  GET_MARKERS,
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
  const { loading: existingLoading, data: existingMarkers } = useQuery(
    GET_MARKERS,
    {
      variables: { userId },
    }
  );
  const [addMarkers] = useMutation(ADD_MARKERS);
  // console.log(userId);

  const handleSave = async () => {
    try {
      if (markers.length === 0) {
        return alert("Please add a new card before saving");
      }

      const result = await addMarkers({
        variables: {
          userId,
          markers: markers,
        },
      });

      if (result) {
        refetch();
        console.log("Markers saved successfully!");
      }
    } catch (error) {
      console.error("Error saving marker:", error);
    }
  };

//   console.log("markers", markers);

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
            handleSave={handleSave}
          />
        </section>
      )}
    </DefaultLayout>
  );
};

export default Page;


