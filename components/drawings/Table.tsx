"use client";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import ModalWrapper, { ModalWrapper2D, ViewModalWrapper } from "./Modal";
import { useMutation, useQuery } from "@apollo/client";
import {
    ADD_2D_FILENAME,
    ADD_3D_FILENAME,
    ADD_AB_FILENAME,
    ADD_BOQ_FILENAME,
    ADD_MB_FILENAME,
    GET_MARKER_GROUP_BY_ID_2D,
    GET_MARKER_GROUP_BY_ID_3D,
    GET_MARKER_GROUP_BY_ID_AB,
    GET_MARKER_GROUP_BY_ID_BOQ,
    GET_MARKER_GROUP_BY_ID_MB,
} from "@/lib/Queries";

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
    // console.log(data, "data in table rows");

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
                                ) : fileType === "moodBoard" ? (
                                    <span className="block mb-1 font-medium">
                                        {user.drawingMBfiles.length}
                                    </span>
                                ) : fileType === "approvalBoard" ? (
                                    <span className="block mb-1 font-medium">
                                        {user.drawingABfiles.length}
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
                        </motion.tr>
                    ))}
                </>
            )}
        </>
    );
};

export default ShuffleSortTable;

export const SuperAdminTable = ({
    data,
    refetchUsers,
    role,
}: {
    data: any;
    refetchUsers: any;
    role: any;
}) => {
    return (
        <div className="md:w-full w-[90vw] overflow-hidden">
            <div className="w-full bg-white shadow-lg rounded-lg overflow-x-scroll xl:overflow-hidden sidebar_scroll_2">
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
                        <TableRows2 refetchUsers={refetchUsers} data={data} role={role} />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TableRows2 = ({
    data,
    refetchUsers,
    role,
}: {
    data: any;
    refetchUsers: any;
    role: any;
}) => {
    const [uploadFile2D] = useMutation(ADD_2D_FILENAME);
    const [uploadFile3D] = useMutation(ADD_3D_FILENAME);
    const [uploadFileMB] = useMutation(ADD_MB_FILENAME);
    const [uploadFileAB] = useMutation(ADD_AB_FILENAME);
    const [uploadFileBOQ] = useMutation(ADD_BOQ_FILENAME);

    const drawing2d =
        data?.drawing2Dfiles && data.drawing2Dfiles.length > 0
            ? data.drawing2Dfiles[data.drawing2Dfiles.length - 1]
            : null;

    const drawing3d =
        data?.drawing3Dfiles && data.drawing3Dfiles.length > 0
            ? data.drawing3Dfiles[data.drawing3Dfiles.length - 1]
            : null;

    const drawingMb =
        data?.drawingMBfiles && data.drawingMBfiles.length > 0
            ? data.drawingMBfiles[data.drawingMBfiles.length - 1]
            : null;

    const drawingAb =
        data?.drawingABfiles && data.drawingABfiles.length > 0
            ? data.drawingABfiles[data.drawingABfiles.length - 1]
            : null;

    const drawingBoq =
        data?.drawingBOQfiles && data.drawingBOQfiles.length > 0
            ? data.drawingBOQfiles[data.drawingBOQfiles.length - 1]
            : null;

    const { data: marker2d, refetch } = useQuery(GET_MARKER_GROUP_BY_ID_2D, {
        variables: { drawing2DId: drawing2d?.id },
    });
    const { data: marker3d, refetch: fetch3D } = useQuery(
        GET_MARKER_GROUP_BY_ID_3D,
        {
            variables: { drawing3DId: drawing3d?.id },
        }
    );
    const { data: markerMb, refetch: fetchMB } = useQuery(
        GET_MARKER_GROUP_BY_ID_MB,
        {
            variables: { drawingMbId: drawingMb?.id },
        }
    );
    const { data: markerAb, refetch: fetchAB } = useQuery(
        GET_MARKER_GROUP_BY_ID_AB,
        {
            variables: { drawingAbId: drawingAb?.id },
        }
    );
    const { data: markerBoq, refetch: fetchBoq } = useQuery(
        GET_MARKER_GROUP_BY_ID_BOQ,
        {
            variables: { drawingBoqId: drawingBoq?.id },
        }
    );

    return (
        <>
            <motion.tr className="text-xs sm:text-sm">
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">2D</span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block text-xs text-slate-500">{data?.email}</span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {data?.drawing2Dfiles.length || 0}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <ModalWrapper2D
                        email={data?.email}
                        uploadFile={uploadFile2D}
                        userId={data?.id}
                        refetchUsers={refetchUsers}
                        fileType={"view2d"}
                    />
                </td>
                <td className="p-2 sm:p-4">
                    <ViewModalWrapper
                        pdf={drawing2d?.fileUrl}
                        markerData={marker2d?.getMarkerGroupBy2DId?.data}
                        refetchUsers={refetch}
                        id={drawing2d?.id}
                        markerId={marker2d?.getMarkerGroupBy2DId?.drawing2DId}
                    />
                </td>
            </motion.tr>
            <motion.tr className="text-xs sm:text-sm">
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">3D</span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block text-xs text-slate-500">{data?.email}</span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {data?.drawing3Dfiles.length || 0}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <ModalWrapper2D
                        email={data?.email}
                        uploadFile={uploadFile3D}
                        userId={data?.id}
                        refetchUsers={refetchUsers}
                        fileType={"view3d"}
                    />
                </td>
                <td className="p-2 sm:p-4">
                    <ViewModalWrapper
                        pdf={drawing3d?.fileUrl}
                        markerData={marker3d?.getMarkerGroupBy3DId?.data}
                        refetchUsers={fetch3D}
                        id={drawing3d?.id}
                        markerId={marker3d?.getMarkerGroupBy3DId?.drawing3DId}
                    />
                </td>
            </motion.tr>
            <motion.tr className="text-xs sm:text-sm">
                <td className="p-2 sm:p-4 mx-auto">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        Mood Board
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block text-xs text-slate-500">{data?.email}</span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {data?.drawingMBfiles.length || 0}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <ModalWrapper2D
                        email={data?.email}
                        uploadFile={uploadFileMB}
                        userId={data?.id}
                        refetchUsers={refetchUsers}
                        fileType={"moodBoard"}
                    />
                </td>
                <td className="p-2 sm:p-4">
                    <ViewModalWrapper
                        pdf={drawingMb?.fileUrl}
                        markerData={markerMb?.getMarkerGroupByMBId?.data}
                        refetchUsers={fetchMB}
                        id={drawingMb?.id}
                        markerId={markerMb?.getMarkerGroupByMBId?.drawingMbId}
                    />
                </td>
            </motion.tr>
            <motion.tr className="text-xs sm:text-sm">
                <td className="p-2 sm:p-4 mx-auto">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        Approval Board
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block text-xs text-slate-500">{data?.email}</span>
                </td>
                <td className="p-2 sm:p-4">
                    <span className="block mb-1 font-medium text-center w-3/5">
                        {data?.drawingABfiles?.length || 0}
                    </span>
                </td>
                <td className="p-2 sm:p-4">
                    <ModalWrapper2D
                        email={data?.email}
                        uploadFile={uploadFileAB}
                        userId={data?.id}
                        refetchUsers={refetchUsers}
                        fileType={"approvalBoard"}
                    />
                </td>
                <td className="p-2 sm:p-4">
                    <ViewModalWrapper
                        pdf={drawingAb?.fileUrl}
                        markerData={markerAb?.getMarkerGroupByABId?.data}
                        refetchUsers={fetchAB}
                        id={drawingAb?.id}
                        markerId={markerAb?.getMarkerGroupByABId?.drawingAbId}
                    />
                </td>
            </motion.tr>
            {role !== "design admin" && (
                <motion.tr className="text-xs sm:text-sm">
                    <td className="p-2 sm:p-4">
                        <span className="block mb-1 font-medium text-center w-3/5">
                            BOQ
                        </span>
                    </td>
                    <td className="p-2 sm:p-4">
                        <span className="block text-xs text-slate-500">{data?.email}</span>
                    </td>
                    <td className="p-2 sm:p-4">
                        <span className="block mb-1 font-medium text-center w-3/5">
                            {data?.drawingBOQfiles.length || 0}
                        </span>
                    </td>
                    <td className="p-2 sm:p-4">
                        <ModalWrapper2D
                            email={data?.email}
                            uploadFile={uploadFileBOQ}
                            userId={data?.id}
                            refetchUsers={refetchUsers}
                            fileType={"viewboq"}
                        />
                    </td>
                    <td className="p-2 sm:p-4">
                        <ViewModalWrapper
                            pdf={drawingBoq?.fileUrl}
                            markerData={markerBoq?.getMarkerGroupByBoqId?.data}
                            refetchUsers={fetchBoq}
                            id={drawingBoq?.id}
                            markerId={markerBoq?.getMarkerGroupByBoqId?.drawingBoqId}
                        />
                    </td>
                </motion.tr>
            )}
        </>
    );
};
