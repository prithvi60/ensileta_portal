"use client";
import { motion } from "framer-motion";
import React from "react";
import ModalWrapper, { ModalWrapper2D, ViewModalWrapper } from "./Modal";
import { useMutation } from "@apollo/client";
import { ADD_2D_FILENAME, ADD_3D_FILENAME, ADD_BOQ_FILENAME } from "@/lib/Queries";

interface Data {
    uploadFile: any;
    // version: number
    // pdf: string
    // id: number
    data: any;
    fileType: string;
    refetchUsers: any;
}

const ShuffleSortTable = ({
    uploadFile,
    data,
    fileType,
    refetchUsers,
}: Data) => {
    return (
        <div className="md:w-full w-[90vw] overflow-hidden">
            <Table
                uploadFile={uploadFile}
                fileType={fileType}
                data={data}
                refetchUsers={refetchUsers}
            />
        </div>
    );
};

const Table = ({ uploadFile, data, fileType, refetchUsers }: Data) => {
    return (
        <div className="w-full bg-white shadow-lg rounded-lg overflow-x-auto">
            <table className="w-full min-w-[500px]">
                <thead>
                    <tr className="border-b-[1px] border-slate-200 text-slate-400 text-sm uppercase">
                        <th className="text-start p-2 sm:p-4 font-medium">Company</th>
                        <th className="text-start p-2 sm:p-4 font-medium">Email</th>
                        <th className="text-start p-2 sm:p-4 font-medium">Version</th>
                        <th className="text-start p-2 sm:p-4 font-medium">File Upload</th>
                        <th className="text-start p-2 sm:p-4 font-medium">View File</th>
                    </tr>
                </thead>

                <tbody>
                    <TableRows
                        uploadFile={uploadFile}
                        refetchUsers={refetchUsers}
                        // pdf={pdf}
                        // id={id}
                        data={data}
                        fileType={fileType}
                    />
                </tbody>
            </table>
        </div>
    );
};

interface TableRowsProps {
    uploadFile: any;
    // pdf: string
    // id: number
    data: any;
    fileType: string;
    refetchUsers: any;
}

const TableRows = ({
    uploadFile,
    data,
    fileType,
    refetchUsers,
}: TableRowsProps) => {
    return (
        <>
            {data && (
                <>
                    {data.map((user: any) => (
                        <motion.tr className="text-xs sm:text-sm" key={user.id}>
                            <td className="p-2 sm:p-4 flex items-center gap-3 overflow-hidden">
                                <span className="block mb-1 font-medium">
                                    {user.company_name}
                                </span>
                            </td>
                            <td className="p-2 sm:p-4 flex items-center gap-3 overflow-hidden">
                                <span className="block text-xs text-slate-500">
                                    {user.email}
                                </span>
                            </td>
                            <td className="p-2 sm:p-4">
                                {fileType === "view2d" ? (
                                    <span className="block mb-1 font-medium">
                                        {user.drawing2Dfiles.length}
                                    </span>
                                ) : fileType === "view3d" ? (
                                    <span className="block mb-1 font-medium">
                                        {user.drawing3Dfiles.length}
                                    </span>
                                ) : fileType === "viewboq" ? (
                                    <span className="block mb-1 font-medium">
                                        {user.drawingBOQfiles.length}
                                    </span>
                                ) : (
                                    <span className="block mb-1 font-medium">0</span>
                                )}
                            </td>
                            <td className="p-2 sm:p-4">
                                <ModalWrapper
                                    email={user.email}
                                    uploadFile={uploadFile}
                                    userId={user.id}
                                    fileType={fileType}
                                    refetchUsers={refetchUsers}
                                />
                            </td>
                            <td className="p-2 sm:p-4">
                                {fileType === "view2d" ? (
                                    <ViewModalWrapper
                                        pdf={
                                            user?.drawing2Dfiles[user?.drawing2Dfiles.length - 1]
                                                ?.fileUrl || null
                                        }
                                    />
                                ) : fileType === "view3d" ? (
                                    <ViewModalWrapper
                                        pdf={
                                            user?.drawing3Dfiles[user?.drawing3Dfiles.length - 1]
                                                ?.fileUrl || null
                                        }
                                    />
                                ) : fileType === "viewboq" ? (
                                    <ViewModalWrapper
                                        pdf={
                                            user?.drawingBOQfiles[user?.drawingBOQfiles.length - 1]
                                                ?.fileUrl || null
                                        }
                                    />
                                ) : (
                                    <ViewModalWrapper pdf={""} />
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </>
            )}
        </>
    );
};

export default ShuffleSortTable;

export const SuperAdminTable = ({
    // uploadFile,
    data,
    // fileType,
    refetchUsers,
}: { data: any, refetchUsers: any }) => {
    return (
        <div className="md:w-full w-[90vw] overflow-hidden">
            <div className="w-full bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="w-full min-w-[500px]">
                    <thead>
                        <tr className="border-b-[1px] border-slate-200 text-slate-400 text-sm uppercase">
                            <th className="text-start p-2 sm:p-4 font-medium">Drawing</th>
                            <th className="text-start p-2 sm:p-4 font-medium">Email</th>
                            <th className="text-start p-2 sm:p-4 font-medium">Version</th>
                            <th className="text-start p-2 sm:p-4 font-medium">File Upload</th>
                            <th className="text-start p-2 sm:p-4 font-medium">View File</th>
                        </tr>
                    </thead>

                    <tbody>
                        <TableRows2
                            // uploadFile={uploadFile}
                            refetchUsers={refetchUsers}
                            // // pdf={pdf}
                            // // id={id}
                            data={data}
                        // fileType={fileType}
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TableRows2 = ({ data, refetchUsers }: { data: any, refetchUsers: any }) => {
    const [uploadFile2D] = useMutation(ADD_2D_FILENAME);
    const [uploadFile3D] = useMutation(ADD_3D_FILENAME);
    const [uploadFileBOQ] = useMutation(ADD_BOQ_FILENAME);
    const drawing2d =
        data?.drawing2Dfiles[data.drawing2Dfiles.length - 1];
    const drawing3d =
        data?.drawing3Dfiles[data.drawing3Dfiles.length - 1];
    const drawingBoq =
        data?.drawingBOQfiles[data.drawingBOQfiles.length - 1];

    return (
        <>
            <motion.tr className="text-xs sm:text-sm">
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        2D
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block text-xs text-slate-500">
                        {data?.email}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {data?.drawing2Dfiles.length}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <ModalWrapper2D
                        email={data?.email}
                        uploadFile={uploadFile2D}
                        userId={data?.id}
                        refetchUsers={refetchUsers}
                    />
                </td>
                <td className="p-2 sm:p-4">
                    <ViewModalWrapper
                        pdf={
                            drawing2d?.fileUrl
                        }
                    />
                </td>
            </motion.tr>
            <motion.tr className="text-xs sm:text-sm">
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        3D
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block text-xs text-slate-500">
                        {data?.email}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {data?.drawing3Dfiles.length}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <ModalWrapper2D
                        email={data?.email}
                        uploadFile={uploadFile3D}
                        userId={data?.id}
                        refetchUsers={refetchUsers}
                    />
                </td>
                <td className="p-2 sm:p-4">
                    <ViewModalWrapper
                        pdf={
                            drawing3d?.fileUrl
                        }
                    />
                </td>
            </motion.tr>
            <motion.tr className="text-xs sm:text-sm">
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        BOQ
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block text-xs text-slate-500">
                        {data?.email}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {data?.drawingBOQfiles.length}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <ModalWrapper2D
                        email={data?.email}
                        uploadFile={uploadFileBOQ}
                        userId={data?.id}
                        refetchUsers={refetchUsers}
                    />
                </td>
                <td className="p-2 sm:p-4">
                    <ViewModalWrapper
                        pdf={
                            drawingBoq?.fileUrl
                        }
                    />
                </td>
            </motion.tr>
        </>
    );
};
