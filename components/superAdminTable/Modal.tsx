"use client"
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
const DeleteModal = ({ isOpen, setIsOpen, setActive, confirmDeleteCard }: any) => {

    return (
        <div className={` px-4 py-64 place-content-center ${!isOpen ? "hidden" : "grid"}`}>
            <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} setActive={setActive} confirmDeleteCard={confirmDeleteCard} />
        </div>
    );
};

const SpringModal = ({ isOpen, setIsOpen, setActive, confirmDeleteCard }: any) => {

    const handleBack = () => {
        setActive(false)
        setIsOpen(false);
    }


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-[1001] grid p-8 overflow-y-scroll cursor-pointer bg-slate-900/50 backdrop-blur place-items-center"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-xl p-6 overflow-hidden text-white rounded-lg shadow-xl cursor-default bg-primary"
                    >
                        <div className="relative z-10">
                            <div className="grid w-16 h-16 mx-auto mb-2 text-3xl text-white rounded-full bg-warning place-items-center">
                                <FiAlertCircle />
                            </div>
                            {/* <h3 className="mb-2 text-3xl font-bold text-center text-info">
                                Disclaimer
                            </h3> */}
                            <p className="mb-6 text-center text-white capitalize">
                                Are you sure you want to delete this note? This action is permanent and cannot be undone.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleBack}
                                    className="w-full py-2 font-semibold text-white transition-colors rounded bg-success hover:bg-info/50 "
                                >
                                    No
                                </button>
                                <button
                                    onClick={confirmDeleteCard}
                                    className="w-full py-2 font-semibold text-white transition-opacity bg-warning rounded hover:opacity-90"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;
