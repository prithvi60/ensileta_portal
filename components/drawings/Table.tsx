'use client'
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import ModalWrapper, { ViewModalWrapper } from "./Modal";


interface Data {
    uploadFile: any
    // version: number
    // pdf: string
    // id: number
    data: any
    fileType: string
}

const ShuffleSortTable = ({ uploadFile, data, fileType }: Data) => {

    return (
        // <div className=" w-full bg-primary">
        <Table uploadFile={uploadFile} fileType={fileType} data={data} />
        // </div >/
    );
};

const Table = ({ uploadFile, data, fileType }: Data) => {

    return (
        <div className="w-full bg-white shadow-lg rounded-lg overflow-x-auto">
            <table className="w-full min-w-[500px]">
                <thead>
                    <tr className="border-b-[1px] border-slate-200 text-slate-400 text-sm uppercase">
                        <th className="text-start p-2 sm:p-4 font-medium">Company</th>
                        <th className="text-start p-2 sm:p-4 font-medium">Version</th>
                        <th className="text-start p-2 sm:p-4 font-medium">File Upload</th>
                        <th className="text-start p-2 sm:p-4 font-medium">View File</th>
                    </tr>
                </thead>

                <tbody>
                    <TableRows
                        uploadFile={uploadFile}
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
    uploadFile: any
    // pdf: string
    // id: number
    data: any
    fileType: string
}

const TableRows = ({ uploadFile, data, fileType }: TableRowsProps) => {

    return (
        <>
            {data && (
                <>
                    {data.map((user: any) => (
                        <motion.tr className="text-xs sm:text-sm" key={user.id}>
                            <td className="p-2 sm:p-4 flex items-center gap-3 overflow-hidden">
                                <div>
                                    <span className="block mb-1 font-medium">{user.company_name}</span>
                                    <span className="block text-xs text-slate-500">{user.email}</span>
                                </div>
                            </td>
                            <td className="p-2 sm:p-4">
                                {fileType === "view2d" ? (<span className="block mb-1 font-medium">{user.drawing2Dfiles.length}</span>) : fileType === "view3d" ? (<span className="block mb-1 font-medium">{user.drawing3Dfiles.length}</span>) : fileType === "viewboq" ? (<span className="block mb-1 font-medium">{user.drawingBOQfiles.length}</span>) : (<span className="block mb-1 font-medium">0</span>)}
                            </td>
                            <td className="p-2 sm:p-4">
                                <ModalWrapper email={user.email} uploadFile={uploadFile} userId={user.id} fileType={fileType} />
                            </td>
                            <td className="p-2 sm:p-4">
                                {fileType === "view2d" ? (
                                    <ViewModalWrapper pdf={user?.drawing2Dfiles[user?.drawing2Dfiles.length - 1]?.fileUrl || null} />
                                ) : fileType === "view3d" ? (
                                    <ViewModalWrapper pdf={user?.drawing3Dfiles[user?.drawing3Dfiles.length - 1]?.fileUrl || null} />
                                ) : fileType === "viewboq" ? (
                                    <ViewModalWrapper pdf={user?.drawingBOQfiles[user?.drawingBOQfiles.length - 1]?.fileUrl || null} />
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
