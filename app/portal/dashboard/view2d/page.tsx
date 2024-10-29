"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import {
  ADD_2D_FILENAME,
  ADD_MARKER_GROUP,
  GET_ALL_2D_VIEW,
  GET_ALL_MARKER_GROUPS,
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

  const [addMarkerGroup] = useMutation(ADD_MARKER_GROUP);
  // console.log(data);

  // const handleSave = async ({ id, comment, left, top }: { id: number, comment: string, left: any, top: any }) => {
  //   await addMarkerGroup({
  //     variables: {
  //       input: {
  //         drawing2DId: id,
  //         markers: [
  //           {
  //             comment,
  //             left,
  //             top,
  //             user: 'Web Dev',
  //             userId: 1,
  //           },
  //         ],
  //       },
  //     },
  //   });
  // };

  const handleSave = async (id: any, markers: any) => {
    try {
      await addMarkerGroup({
        variables: { data: { drawing2DId: id, markers: markers.flat() } },
      });
      alert("Successfully saved!");
    } catch (err) {
      console.error(err);
    }
  };

  // console.log("data", data);

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
            addMarkerGroup={addMarkerGroup}
          />
        </section>
      )}
    </DefaultLayout>
  );
};

export default Page;
