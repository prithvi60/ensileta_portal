import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import UploadFile from "./Upload";
import ModalWrapper from "./Modal";
// import { FiAward, FiChevronDown, FiChevronUp } from "react-icons/fi";

const ShuffleSortTable = ({ uploadFile, version }: { uploadFile: any, version: number }) => {
    return (
        <div className="p-8 w-full bg-primary">
            <Table uploadFile={uploadFile} version={version} />
        </div>
    );
};

const Table = ({ uploadFile, version }: { uploadFile: any, version: number }) => {
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
                    </tr>
                </thead>

                <tbody>
                    {/* {users.map((user, index) => { */}
                    {/* return ( */}
                    <TableRows
                        user={user}
                        uploadFile={uploadFile}
                        version={version}
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
}

const TableRows = ({ user, uploadFile, version }: TableRowsProps) => {

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
                {/* <UploadFile uploadFile={uploadFile} /> */}
                {/* <button
                    type="submit"
                    className={`w-max cursor-pointer py-4 px-10 text-white transition  bg-secondary mb-5 hover:bg-[#0E122B]`}
                >upload
                </button> */}
                <ModalWrapper uploadFile={uploadFile} />
            </td>
        </motion.tr>
    );
};

export default ShuffleSortTable;


interface User {
    userName: string
    email: string
}