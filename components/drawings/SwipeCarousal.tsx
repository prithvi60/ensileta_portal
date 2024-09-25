import React, { useState } from "react";
import { motion, AnimatePresence, } from "framer-motion";
import { usePDFJS } from "@/hooks/usePdfJS";
import FsLightbox from "fslightbox-react";

export default function ModernCarousel({ pdf, version, id }: { pdf: string, version: number, id: number }) {
    const [idx, setIdx] = useState(0);
    const [prevIdx, setPrevIdx] = useState(idx);
    const [imgs, setImgs] = useState<string[]>([]);
    const [toggle, setToggle] = useState(false)
    const [selectedItem, setSelectedItem] = useState(0);
    const [lightboxController, setLightboxController] = useState({
        toggler: toggle,
        slide: selectedItem + 1,
    });

    function openLightboxOnSlide(number: number) {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number + 1,
        });
        setToggle(true)
    }

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
                    imgArray.push(canvas.toDataURL());
                }
            }
            setImgs(imgArray);

            // }
        } catch (error) {
            console.error("Error loading PDF:", error);
        }
    });


    const trend = idx > prevIdx ? 1 : -1;

    const imageIndex = Math.abs(idx % imgs.length);

    return (
        <div className="h-[30vw] min-h-[200px] max-h-[400px] 3xl:h-[60vw] 3xl:min-h-[550px] 3xl:max-h-[800px] bg-black relative overflow-hidden">
            <button
                onClick={() => {
                    setPrevIdx(idx);
                    setIdx((pv) => pv - 1);
                }}
                className="bg-primary hover:bg-primary/50 transition-colors text-white p-2 absolute z-10 left-0 top-0 bottom-0"
            >
                <svg width="20px" height="20px" viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://bg-primary hover:bg-primary/50www.w3.org/2000/svg">
                    <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="#fafafa" />
                </svg>
            </button>
            <div className="absolute inset-0 z-[5] backdrop-blur-xl cursor-pointer">
                <AnimatePresence initial={false} custom={trend}>
                    {imgs.length > 0 ? (
                        <motion.img
                            onClick={() => openLightboxOnSlide(imageIndex)}
                            variants={imgVariants}
                            custom={trend}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            key={imgs[imageIndex]}
                            src={imgs[imageIndex]}
                            alt={"image"}
                            style={{ y: "-50%", x: "-50%" }}
                            className="aspect-square max-h-[90%] max-w-[calc(100%_-_80px)] mx-auto bg-black object-cover shadow-2xl absolute left-1/2 top-1/2"
                            onContextMenu={(e) => e.preventDefault()} // Disable right-click
                        />) : (<motion.img
                            onClick={() => openLightboxOnSlide(imageIndex)}
                            variants={imgVariants}
                            custom={trend}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            key={imgs[imageIndex]}
                            src={"/logo/newlogo.png"}
                            alt={"image"}
                            style={{ y: "-50%", x: "-50%" }}
                            className="aspect-video max-h-[90%] max-w-[calc(100%_-_80px)] mx-auto bg-black object-contain shadow-2xl absolute left-1/2 top-1/2"
                            onContextMenu={(e) => e.preventDefault()} // Disable right-click
                        />)}
                </AnimatePresence>
            </div>
            <div className="absolute inset-0 z-[10] pointer-events-none" /> {/* Transparent overlay */}
            <button
                onClick={() => {
                    setPrevIdx(idx);
                    setIdx((pv) => pv + 1);
                }}
                className="bg-primary hover:bg-primary/50 transition-colors text-white p-2 absolute z-10 right-0 top-0 bottom-0"
            >
                <svg width="20px" height="20px" viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#fafafa" />
                </svg>
            </button>

            <AnimatePresence initial={false} custom={trend}>
                <motion.span
                    custom={trend}
                    variants={titleVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    key={imgs[imageIndex]}
                    className="text-white text-base md:text-xl p-2 rounded-lg bg-white/10 backdrop-blur-lg font-semibold shadow-lg absolute z-20 left-10 bottom-4"
                >
                    {`Version: ${version}`}
                </motion.span>
            </AnimatePresence>

            <AnimatePresence initial={false}>
                <motion.div
                    key={id + imgs.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 object-fill z-0"
                    style={{
                        backgroundImage: `url(${imgs[imageIndex]})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                />
            </AnimatePresence>
            <FsLightbox
                exitFullscreenOnClose={true}
                toggler={lightboxController.toggler}
                sources={imgs.map((img) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        key={img}
                        src={img}
                        alt="image"
                        onContextMenu={(e) => e.preventDefault()} // Disable right-click
                    />
                ))}
                type="image"
                slide={lightboxController.slide}
                onClose={() => setToggle(false)}

            />
        </div>
    );
}

const imgVariants = {
    initial: (trend: 1 | 0) => ({
        x: trend === 1 ? "200%" : "-200%",
        opacity: 0,
    }),
    animate: { x: "-50%", opacity: 1 },
    exit: (trend: 1 | 0) => ({
        x: trend === 1 ? "-200%" : "200%",
        opacity: 0,
    }),
};

const titleVariants = {
    initial: (trend: 1 | 0) => ({
        y: trend === 1 ? 20 : -20,
        opacity: 0,
    }),
    animate: { y: 0, opacity: 1 },
    exit: (trend: 1 | 0) => ({
        y: trend === 1 ? -20 : 20,
        opacity: 0,
    }),
};