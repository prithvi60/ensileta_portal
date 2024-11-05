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
    const { data } = useQuery<GetAll3DViewResponse>(GET_ALL_3D_VIEW);
    const { data: AllUsers, loading, refetch } = useQuery(GET_USERS);
    const pathname = usePathname();
    const fileType = pathname.split("/").pop();
    const lastItem =
        data?.getAll3DFiles[data?.getAll3DFiles.length - 1] ||
        data?.getAll3DFiles[0] ||
        null;
    // console.log(lastItem?.id);

    const [createMarkerGroup] = useMutation(CREATE_MARKER_GROUP_3D, {
        refetchQueries: [
            { query: GET_MARKER_GROUP_BY_ID_3D, variables: { drawing3DId: lastItem?.id } },
        ],
        awaitRefetchQueries: true,
    });
    const { data: marker3d } = useQuery(GET_MARKER_GROUP_BY_ID_3D, {
        variables: { drawing3DId: lastItem?.id },
    });

    console.log("get", marker3d);


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

// "use client";
// import { GetAll2dView } from '@/components/GetAll2dView';
// import { InputForm } from '@/components/InputForm';
// import DefaultLayout from '@/components/Layout/DefaultLayout';
// import { ADD_3D_FILENAME, GET_ALL_3D_VIEW, GET_USER } from '@/lib/Queries';
// import { useMutation, useQuery } from '@apollo/client';
// import React, { ChangeEvent, FormEvent, useState } from 'react'
// import toast from 'react-hot-toast';

// interface GetAll3DViewResponse {
//     getAll3DFiles: Array<{
//         id: number;
//         fileName: string;
//         fileURL: string;
//         version: number;
//         createdAt: string;
//     }>;
// }

// const Page = () => {
//     const [inputValue, setInputValue] = useState<string>("");
//     const [view3dFileName] = useMutation(ADD_3D_FILENAME, {
//         refetchQueries: [{ query: GET_ALL_3D_VIEW }]
//     })
//     const { data, loading, error } = useQuery<GetAll3DViewResponse>(GET_ALL_3D_VIEW)
//     const { data: RoleBased, } = useQuery(GET_USER);
//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.value) {
//             setInputValue(e.target.value || '')
//         }
//     }

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!inputValue) {
//             alert("please enter file name")
//             return
//         } else {
//             try {
//                 const result = await view3dFileName({ variables: { fileName: inputValue } })
//                 if (result) {
//                     toast.success('successfully Created', {
//                         position: "top-right",
//                         duration: 3000,
//                         style: {
//                             border: '1px solid #65a34e',
//                             padding: '16px',
//                             color: '#65a34e',
//                         },
//                         iconTheme: {
//                             primary: '#65a34e',
//                             secondary: '#FFFAEE',
//                         },
//                     })
//                     setInputValue('');
//                 }
//             } catch (error) {
//                 console.error(error)
//             }

//         }
//     }

//     return (
//         <DefaultLayout>
//             <section className='h-[500px] w-full space-y-10'>
//                 {RoleBased?.user?.role === "super admin" ? (
//                     <InputForm handleChange={handleChange} handleSubmit={handleSubmit} inputValue={inputValue} />
//                 ) : (
//                     <div className='w-full h-auto flex justify-center items-center'>
//                         <button type="submit" className='cursor-pointer p-1.5 shadow-md select-none bg-secondary text-white rounded-md'>Approval</button>
//                     </div>
//                 )}

//                 {/* <GetAll2dView loading={loading} error={error} data={data?.getAll3DFiles} /> */}
//             </section>
//         </DefaultLayout>
//     );
// };

// export default Page;
