import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import ModalWrapper, { ViewModalWrapper } from "./Modal";

interface Data {
    uploadFile: any
    version: number
    pdf: string
    id: number

}

const ShuffleSortTable = ({ uploadFile, version, pdf, id }: Data) => {
    return (
        <div className="p-8 w-full bg-primary">
            <Table uploadFile={uploadFile} version={version} pdf={pdf} id={id} />
        </div>
    );
};

const Table = ({ uploadFile, version, pdf, id }: Data) => {
    const { data: session } = useSession()
    // console.log(session);
    const user: User = {
        userName: session?.user?.name ?? 'Unknown',
        email: session?.user?.email ?? 'No email',

    }

    return (
        <div className="w-full bg-white shadow-lg rounded-lg overflow-x-scroll max-w-4xl mx-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b-[1px] border-slate-200 text-slate-400 text-sm uppercase">
                        <th className="text-start p-4 font-medium">Team Member</th>
                        <th className="text-start p-4 font-medium">Version</th>
                        <th className="text-start p-4 font-medium">File Upload</th>
                        <th className="text-start p-4 font-medium">View File</th>
                    </tr>
                </thead>

                <tbody>
                    {/* {users.map((user, index) => { */}
                    {/* return ( */}
                    <TableRows
                        user={user}
                        uploadFile={uploadFile}
                        version={version}
                        pdf={pdf}
                        id={id}
                    />
                    {/* ); */}
                    {/* })} */}
                </tbody>
            </table>
        </div>
    );
};

interface TableRowsProps {
    user: User;
    uploadFile: any
    version: number
    pdf: string
    id: number
}

const TableRows = ({ user, uploadFile, version, pdf, id }: TableRowsProps) => {

    return (
        <motion.tr
            // layoutId={`row-${user.id}`}
            // className={`text-sm ${user.id % 2 ? "bg-slate-100" : "bg-white"}`}
            className="text-sm"
        >
            <td className="p-4 flex items-center gap-3 overflow-hidden">
                <div>
                    <span className="block mb-1 font-medium">{user.userName}</span>
                    <span className="block text-xs text-slate-500">{user.email}</span>
                </div>
            </td>
            <td className="p-4">

                <span className="block mb-1 font-medium ml-7">{version}</span>
            </td>
            <td className="p-4 ">
                <ModalWrapper uploadFile={uploadFile} />
            </td>
            <td className="p-4 ">
                <ViewModalWrapper version={version} pdf={pdf} id={id} />
            </td>
        </motion.tr>
    );
};

export default ShuffleSortTable;


interface User {
    userName: string
    email: string
}