"use client"
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import UploadFile from "./Upload";
import FsLightbox from "fslightbox-react";
import { usePDFJS } from "@/hooks/usePdfJS";

const ModalWrapper = ({ uploadFile, userId }: { uploadFile: any, userId: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className={`w-max cursor-pointer py-4 px-10 text-white bg-secondary mb-5 hover:bg-[#0E122B] transition-colors`}
            >upload
            </button>
            <SpringModal isOpen={isOpen} userId={userId} setIsOpen={setIsOpen} uploadFile={uploadFile} />
        </div>
    );
};

const SpringModal = ({ isOpen, setIsOpen, uploadFile, userId }: { isOpen: boolean, setIsOpen: Function, uploadFile: any, userId: number }) => {
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
                            <UploadFile uploadFile={uploadFile} userId={userId} setIsOpen={setIsOpen} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalWrapper;

export const ViewModalWrapper = ({ pdf }: { pdf: string }) => {
    const [toggle, setToggle] = useState(false)
    const [imgs, setImgs] = useState<string[]>([]);

    usePDFJS(async (pdfjs) => {
        try {

            const url = pdf;
            const response = await fetch(url);
            const data = await response.arrayBuffer();
            // console.log("data",url,data)
            const loadingTask = pdfjs.getDocument(new Uint8Array(data));
            const pdfDocument = await loadingTask.promise;
            const imgArray: string[] = [];

            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const viewport = page.getViewport({ scale: 1 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    await page.render(renderContext).promise;
                    const imageUrl = canvas.toDataURL();
                    imgArray.push(imageUrl);
                }
            }

            if (imgArray.length === 0) {
                throw new Error("No images were generated from the PDF.");
            }

            setImgs(imgArray);

            // }
        } catch (error) {
            console.error("Error loading PDF:", error);
        }
    });

    return (
        <div>
            <button
                disabled={imgs.length === 0 ? true : false}
                onClick={() => setToggle(!toggle)}
                className={`w-max cursor-pointer py-4 px-10 text-white bg-secondary mb-5 hover:bg-[#0E122B] transition-colors disabled:bg-opacity-70 disabled:cursor-not-allowed`}
            >View</button>
            <FsLightbox
                exitFullscreenOnClose={true}
                toggler={toggle}
                sources={imgs.length > 0 ? imgs : []}
                type="image"
            />
        </div>
    );
};
