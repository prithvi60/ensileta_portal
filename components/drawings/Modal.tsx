import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import UploadFile from "./Upload";
import ModernCarousel from "./SwipeCarousal";

const ModalWrapper = ({ uploadFile }: { uploadFile: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div >
            <button
                onClick={() => setIsOpen(true)}
                className={`w-max cursor-pointer py-4 px-10 text-white bg-secondary mb-5 hover:bg-[#0E122B] transition-colors`}
            >upload
            </button>
            <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} uploadFile={uploadFile} />
        </div>
    );
};

const SpringModal = ({ isOpen, setIsOpen, uploadFile }: { isOpen: boolean, setIsOpen: Function, uploadFile: any }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-[1001] grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-primary text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                    >

                        <div className="relative z-10 space-y-6">
                            <h3 className="text-3xl font-bold text-center mb-2">
                                Upload File
                            </h3>
                            <UploadFile uploadFile={uploadFile} setIsOpen={setIsOpen}/>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalWrapper;

interface Data {
    version: number
    pdf: string
    id: number
}

export const ViewModalWrapper = ({ version, pdf, id }: Data) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div >
            <button
                onClick={() => setIsOpen(true)}
                className={`w-max cursor-pointer py-4 px-10 text-white bg-secondary mb-5 hover:bg-[#0E122B] transition-colors`}
            >View
            </button>
            <ViewSpringModal isOpen={isOpen} setIsOpen={setIsOpen} version={version} pdf={pdf} id={id} />
        </div>
    );
};

const ViewSpringModal = ({ isOpen, setIsOpen, pdf, version, id }: {
    isOpen: boolean, setIsOpen: Function, version: number,
    pdf: string,
    id: number
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-[1001] grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-primary text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                    >

                        <div className="relative z-10 space-y-6">
                            <h3 className="text-3xl font-bold text-center mb-2">
                                Uploaded File
                            </h3>
                            <ModernCarousel version={version} pdf={pdf} id={id} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};