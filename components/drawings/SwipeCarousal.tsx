import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, useMotionValue, AnimatePresence, } from "framer-motion";
import { usePDFJS } from "@/hooks/usePdfJS";
import FsLightbox from "fslightbox-react";

// const ONE_SECOND = 1000;
// const AUTO_DELAY = ONE_SECOND * 10;
// const DRAG_BUFFER = 50;

// const SPRING_OPTIONS = {
//     type: "spring",
//     mass: 3,
//     stiffness: 400,
//     damping: 50,
// };

// const ImgData = ["/cover/banner-img.jpg", "/cover/bg-cover.jpg", "/cover/cover-01.png"]

// const FsLightbox = dynamic(() => import("fslightbox-react"), { ssr: false });

// export const SwipeCarousel = ({ pdf, version }: { pdf: string, version: number }) => {
//     const [imgIndex, setImgIndex] = useState(0);
//     const [imgs, setImgs] = useState<string[]>([]);
//     const dragX = useMotionValue(0);
//     const [toggle, setToggle] = useState(false)
//     const [selectedItem, setSelectedItem] = useState(0);
//     const [lightboxController, setLightboxController] = useState({
//         toggler: toggle,
//         slide: selectedItem + 1,
//     });

//     function openLightboxOnSlide(number: number) {
//         setLightboxController({
//             toggler: !lightboxController.toggler,
//             slide: number + 1,
//         });
//         setToggle(true)
//     }

//     usePDFJS(async (pdfjs) => {
//         try {
//             // const url = "/2dview-dummy.pdf"; 
//             // const response = await fetch(url)
//             // use S3
//             // if (pdf) {

//             const url = pdf;
//             const response = await fetch(url);
//             const data = await response.arrayBuffer();
//             // console.log("data",url,data)
//             const loadingTask = pdfjs.getDocument(new Uint8Array(data));
//             const pdfDocument = await loadingTask.promise;
//             const imgArray: string[] = [];

//             for (let i = 1; i <= pdfDocument.numPages; i++) {
//                 const page = await pdfDocument.getPage(i);
//                 const viewport = page.getViewport({ scale: 1 });
//                 const canvas = document.createElement("canvas");
//                 const context = canvas.getContext("2d");
//                 canvas.height = viewport.height;
//                 canvas.width = viewport.width;

//                 if (context) {
//                     const renderContext = {
//                         canvasContext: context,
//                         viewport: viewport,
//                     };
//                     await page.render(renderContext).promise;
//                     imgArray.push(canvas.toDataURL());
//                 }
//             }
//             setImgs(imgArray);

//             // }
//         } catch (error) {
//             console.error("Error loading PDF:", error);
//         }
//     });

//     const onDragEnd = () => {
//         const x = dragX.get();

//         if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
//             setImgIndex((pv) => pv + 1);
//         } else if (x >= DRAG_BUFFER && imgIndex > 0) {
//             setImgIndex((pv) => pv - 1);
//         }
//     };

//     return (
//         <>
//             <div className="relative w-full overflow-hidden bg-neutral-950 py-1.5 rounded-lg">
//                 <motion.div
//                     drag="x"
//                     dragConstraints={{ left: 0, right: 0 }}
//                     style={{ x: dragX }}
//                     animate={{ translateX: `-${imgIndex * 100}%` }} // {{ edit_1 }} Fixed template literal syntax
//                     transition={SPRING_OPTIONS}
//                     onDragEnd={onDragEnd}
//                     className="flex cursor-grab items-center active:cursor-grabbing"
//                 >
//                     <Images imgIndex={imgIndex} imgs={imgs} openLightboxOnSlide={openLightboxOnSlide} />
//                 </motion.div>
//                 <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} imgs={imgs.length > 0 ? imgs : [""]} />
//                 <GradientEdges />
//             </div>
//             {/* <h4 className="text-2xl font-medium text-center w-full capitalize">{fileName.replace(".pdf", "").toLowerCase()}</h4> */}
//             <h4 className='w-full text-center text-2xl font-medium tracking-wide'>{`version : ${version}`}</h4>
//             <FsLightbox
//                 exitFullscreenOnClose={true}
//                 toggler={lightboxController.toggler}
//                 sources={imgs}
//                 type="image"
//                 slide={lightboxController.slide}
//                 onClose={() => setToggle(false)}

//             />
//         </>
//     );
// };

// const Images = ({ imgIndex, imgs, openLightboxOnSlide }: { imgIndex: number; imgs: string[], openLightboxOnSlide: any }) => {
//     return (
//         <>
//             {imgs.map((imgSrc, idx) => (
//                 <motion.div
//                     key={idx}
//                     style={{
//                         backgroundImage: `url(${imgSrc})`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                     }}
//                     onClick={() => openLightboxOnSlide(idx)}
//                     animate={{ scale: imgIndex === idx ? 0.95 : 0.85 }}
//                     transition={SPRING_OPTIONS}
//                     className="aspect-[4/2] lg:aspect-[4/1.5] w-full shrink-0 rounded-xl bg-neutral-800 object-cover"
//                 />
//             ))}
//         </>
//     );
// };

// const Dots = ({
//     imgs,
//     imgIndex,
//     setImgIndex,
// }: {
//     imgs: any;
//     imgIndex: number;
//     setImgIndex: Dispatch<SetStateAction<number>>;
// }) => {
//     return (
//         <div className="mt-2 flex w-full justify-center gap-2">
//             {imgs.map((_: any, idx: number) => (
//                 <button
//                     key={idx}
//                     onClick={() => setImgIndex(idx)}
//                     className={`size-2 md:size-3 rounded-full transition-colors ${idx === imgIndex ? "bg-secondary" : "bg-neutral-500"}`}
//                 />
//             ))}
//         </div>
//     );
// };

// const GradientEdges = () => {
//     return (
//         <>
//             <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />
//             <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
//         </>
//     );
// };

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
            // const url = "/2dview-dummy.pdf"; 
            // const response = await fetch(url)
            // use S3
            // if (pdf) {

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
                    />
                </AnimatePresence>
            </div>
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
                sources={imgs}
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