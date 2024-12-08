import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePDFJS } from "@/hooks/usePdfJS";
import { FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa6";
import { GiVirtualMarker } from "react-icons/gi";
import Slider from "react-slick";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import { FaCircleArrowUp } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import Link from "next/link";
import { Loader } from "../Loader";
import Loader2 from "../Loader2";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";

declare global {
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
  }

  interface Document {
    webkitExitFullscreen?: () => Promise<void>;
    webkitFullscreenElement?: Element;
  }
}

export default function ModernCarousel({
  pdf,
  version,
  id,
  createMarkerGroup,
  userId,
  markerData,
  fileType,
}: {
  pdf: string;
  version: number;
  id: number;
  createMarkerGroup: any;
  userId: number;
  markerData: any;
  fileType: string;
}) {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(idx);
  const [imgs, setImgs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest";
  // console.log(pdf);

  usePDFJS(async (pdfjs) => {
    try {
      setLoading(true);
      const response = await fetch(pdf);
      if (!response.ok) throw new Error("PDF file not found");

      const data = await response.arrayBuffer();
      const loadingTask = pdfjs.getDocument(new Uint8Array(data));
      const pdfDocument = await loadingTask.promise;
      const imgArray: string[] = [];
      const scale = 3; // Increased scale for better quality
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale });
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
      setLoading(false);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setLoading(false);
    }
  });

  const trend = idx > prevIdx ? 1 : -1;
  const imageIndex = Math.abs(idx % imgs.length);

  // Add a keydown event listener to handle navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        // Navigate to the previous image
        setPrevIdx(idx);
        setIdx((prev) => prev - 1);
      } else if (e.key === "ArrowRight") {
        // Navigate to the next image
        setPrevIdx(idx);
        setIdx((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [idx, setIdx, setPrevIdx]);

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    if (e.pointerType === "touch" || e.pointerType === "mouse") {
      e.preventDefault(); // Prevent default actions for both mouse and touch inputs
    }
  };

  return (
    <div className="h-[250px] 2xl:h-[390px] bg-black relative w-full max-w-6xl mx-auto overflow-hidden">
      {/* {fileType === "viewboq" && (
        <Link target='_blank' href={pdf} download className="absolute -top-9 sm:-top-11 lg:-top-14 right-2">
          <button className="rounded-sm w-max p-2 bg-secondary hover:animate-pulse capitalize flex items-center gap-2">
            <h4 className="tracking-wide text-sm md:text-base lg:text-lg text-white hidden sm:block">Download Now</h4>
            <FaDownload className="text-lg lg:text-xl text-white" />
          </button>
        </Link>)} */}
      <button
        onClick={() => {
          setPrevIdx(idx);
          setIdx((pv) => pv - 1);
        }}
        className="bg-primary hover:bg-primary/50 transition-colors text-white p-2 absolute z-10 left-0 top-0 bottom-0"
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 1024 1024"
          className="icon"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
            fill="#fafafa"
          />
        </svg>
      </button>
      <div className="absolute inset-0 z-[5] backdrop-blur-xl cursor-pointer">
        <AnimatePresence initial={false} custom={trend}>
          {imgs.length > 0 ? (
            <motion.img
              onClick={() => setIsOpen(true)}
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
              onPointerDown={(e) => handlePointerDown(e)} // Handle tap-and-hold on mobile
              draggable="false" // Disable drag-and-drop
            />
          ) : (
            <div className="relative w-full h-full">
              <motion.img
                onClick={() => setIsOpen(true)}
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
                onPointerDown={(e) => handlePointerDown(e)} // Handle tap-and-hold on mobile
                draggable="false" // Disable drag-and-drop
              />
              {/* <div className={`${loading ? "block " : "hidden"} absolute bottom-40 right-96`}>
                <Loader2 />
              </div> */}
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 z-[10] pointer-events-none" />{" "}
      {/* Transparent overlay */}
      <button
        onClick={() => {
          setPrevIdx(idx);
          setIdx((pv) => pv + 1);
        }}
        className="bg-primary hover:bg-primary/50 transition-colors text-white p-2 absolute z-10 right-0 top-0 bottom-0"
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 1024 1024"
          className="icon"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z"
            fill="#fafafa"
          />
        </svg>
      </button>
      <AnimatePresence initial={false} custom={trend}>
        {loading ? (
          <div
            className={`p-2 rounded-lg absolute z-20 left-10 bottom-4 bg-white/10 backdrop-blur-lg font-semibold shadow-lg`}
          >
            <Loader2 />
          </div>
        ) : (
          <motion.span
            custom={trend}
            variants={titleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            key={imgs[imageIndex]}
            className="text-white text-base md:text-xl p-2 rounded-lg bg-white/10 backdrop-blur-lg font-semibold shadow-lg absolute z-20 left-10 bottom-4"
          >
            {version === 0
              ? "Your document will show here after upload"
              : `Version: ${version}`}
          </motion.span>
        )}
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
      <SpringModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        createMarkerGroup={createMarkerGroup}
        images={imgs}
        userName={userName}
        userId={userId}
        id={id}
        markerData={markerData}
        fileType={fileType}
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

const SpringModal = ({
  isOpen,
  setIsOpen,
  createMarkerGroup,
  markerData,
  images,
  userName,
  userId,
  id,
  fileType,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  createMarkerGroup: any;
  images: string[];
  userName: string;
  userId: number;
  id: number;
  markerData: any;
  fileType: string;
}) => {
  const [isMarkerEnabled, setIsMarkerEnabled] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const transformWrapperRef = useRef<any>(null);
  const sliderRef = useRef<Slider | null>(null);
  const [markers, setMarkers] = useState<
    Array<Array<Marker & { comment?: string }>>
  >(
    Array.from({ length: images.length }, (_, index) => (index === 0 ? [] : []))
  );

  useEffect(() => {
    if (markerData) {
      const parsedMarkers = JSON.parse(markerData);
      setMarkers(parsedMarkers);
    }
  }, [markerData]);

  useEffect(() => {
    if (transformWrapperRef.current) {
      transformWrapperRef.current.resetTransform();
    }
  }, [index]);

  // Key-down event for slider navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        // Navigate to the previous slide
        if (sliderRef.current && index > 0) {
          sliderRef.current.slickPrev();
        }
      } else if (e.key === "ArrowRight") {
        // Navigate to the next slide
        if (sliderRef.current && index < images.length - 1) {
          sliderRef.current.slickNext();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, index, images.length]);

  const handleSliderChange = (newIndex: number) => {
    setIndex(newIndex);
  };

  // Update the handleAddMarker function to accept an image index
  const handleAddMarker = (
    imageIndex: number,
    marker: Marker,
    comment: string,
    user: string,
    userId: number
  ) => {
    const newMarker = { ...marker, comment: comment, user, userId };
    setMarkers((prevMarkers) => {
      const updatedMarkers = [...prevMarkers];
      const filteredMarkers =
        updatedMarkers[imageIndex]?.filter((m) => m.top !== newMarker.top) ||
        [];
      updatedMarkers[imageIndex] = [...filteredMarkers, newMarker];
      return updatedMarkers;
    });
  };

  const handleClose = async () => {
    try {
      await createMarkerGroup(markers);
    } finally {
      setIsOpen(false);
      toggleFullScreen(isOpen);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow currentSlide={index} slideCount={images.length} />,
    prevArrow: <PrevArrow currentSlide={index} />,
    afterChange: (current: number) => setIndex(current),
  };

  const toggleFullScreen = (shouldEnterFullScreen: boolean) => {
    const element = document.documentElement; // Use the root element for full screen

    if (shouldEnterFullScreen) {
      // Enter full-screen mode
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (element.requestFullscreen) {
          element.requestFullscreen().catch((err) => {
            console.error(
              `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
            );
          });
        } else if (element.webkitRequestFullscreen) {
          // Safari fallback
          element.webkitRequestFullscreen();
        }
      }
    } else {
      // Exit full-screen mode
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((err) => {
            console.error(
              `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
            );
          });
        } else if (document.webkitExitFullscreen) {
          // Safari fallback
          document.webkitExitFullscreen();
        }
      }
    }
  };

  // const handleRemoveMarker = (imageIndex: number, top: number, left: number) => {
  //   setMarkers((prevMarkers) => {
  //     const updatedMarkers = [...prevMarkers];
  //     updatedMarkers[imageIndex] = updatedMarkers[imageIndex].filter(
  //       (marker) => marker.top !== top || marker.left !== left
  //     );
  //     return updatedMarkers;
  //   });
  // };

  useEffect(() => {
    toggleFullScreen(isOpen);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="bg-black/90 backdrop-blur p-8 fixed inset-0 z-[1001] grid place-items-center overflow-y-scroll"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            className="text-white p-6 w-full max-w-80 md:max-w-125 lg:max-w-203 xl:max-w-7xl relative h-full"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()} // Disable right-click
          >
            <div className="slider-container">
              <Slider
                {...settings}
                ref={sliderRef}
                afterChange={handleSliderChange}
              >
                {images.map((src, idx) => {
                  return (
                    <>
                      <ImageMarker
                        key={idx}
                        src={src}
                        markers={markers[idx] || []} // Pass markers for the current image
                        onAddMarker={
                          (marker: Marker) =>
                            handleAddMarker(idx, marker, "", userName, userId) // Pass the current image index
                        }
                        markerComponent={(props) => (
                          <CustomMarker
                            {...props}
                            onAddComment={(marker, comment) =>
                              handleAddMarker(
                                idx,
                                marker,
                                comment,
                                userName,
                                userId
                              )
                            } // Pass the current image index
                            // onRemoveMarker={(top, left) => handleRemoveMarker(idx, top, left)}
                            markers={markers[idx] || []} // Pass markers for the current image
                          />
                        )}
                        extraClass={`cursor-crosshair ${!isMarkerEnabled ? "pointer-events-none" : ""
                          }`}
                      />
                    </>
                  );
                })}
              </Slider>
            </div>
          </motion.div>
          <div className="fixed top-0 left-0 flex">
            <div className="p-2 text-white bg-secondary">
              {index + 1} / {images.length}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                handleClose();
              }}
              className="bg-secondary hover:bg-primary transition-colors text-white p-2 ml-4"
            >
              Close Screen
            </button>
          </div>
          {fileType !== "viewboq" && (
            <div
              className="fixed top-0 right-0 flex bg-white"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
              }}
            >
              {isMarkerEnabled && (
                <div className="text-black text-sm p-2 text-justify items-center flex">
                  Click anywhere to add comment. Please Enter/ click Arrow
                  button to save.
                </div>
              )}
              <button
                type="submit"
                className="cursor-pointer w-max  p-4 shadow-md select-none bg-secondary text-white hover:bg-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMarkerEnabled((o) => !o);
                }}
              >
                {isMarkerEnabled ? "Close Remarks" : "Add Remarks"}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CustomMarker = ({
  onAddComment,
  // onRemoveMarker,
  markers,
  top,
  left,
}: MarkerComponentProps & {
  onAddComment: (marker: Marker, comment: string) => void;
  // onRemoveMarker: (top: number, left: number) => void;
  markers: any;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [storedValue, setStoredValue] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest";
  const [user, setUser] = useState<string>(userName);
  useEffect(() => {
    if (isHovered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isHovered]);
  useEffect(() => {
    const existingMarker = markers.find(
      (marker: { top: Number }) => marker.top === top
    );
    if (existingMarker) {
      setInputValue(existingMarker.comment || ""); // Set comment if exists
      setStoredValue(existingMarker.comment || "");
      setUser(existingMarker.user);
    }
  }, [markers, top]);

  const addComment = () => {
    if (inputValue.trim()) {
      const marker = { top, left };
      onAddComment(marker, inputValue.trim());
      setStoredValue(inputValue.trim());
      setIsHovered(false);
    }
  };

  // @ts-ignore
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents default action of "Enter" key
      addComment();
    }
  };

  const handleBtn = () => {
    addComment();
  };

  const handleBlur = () => {
    // console.log("blur");
    // console.log(inputValue);
    addComment();
    // console.log("blur after");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (inputRef.current && inputValue) {
      inputRef.current.blur(); // Force textarea to lose focus
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {isHovered ? (
        <div className="relative bg-primary bg-opacity-30 rounded-lg p-2 ">
          <label className="mb-.5 block font-extrabold text-white drop-shadow-lg">
            {user}
          </label>
          <div className="relative">
            <textarea
              ref={inputRef}
              // disabled={storedValue.length > 0}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              placeholder="Add comments"
              className=" scrollbar-hidden z-1000 w-full rounded-lg border bg-white border-stroke bg-transparent py-2 pl-2 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none mr-8"
              onKeyDown={handleKeyDown}
              rows={1}
            />
            {storedValue.length === 0 ? (
              <button
                className="absolute right-4 top-[42%] transform -translate-y-1/2 cursor-pointer "
                onClick={handleBtn} // Trigger handleKeyDown on click
              // disabled={storedValue.length > 0}
              >
                <FaCircleArrowUp size={24} className={"text-secondary"} />
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="absolute top-0 left-0 flex items-center ">
          <BiSolidMessageRoundedDots className="bg-white rounded-full text-5xl sm:text-6xl text-secondary shadow-md p-2" />
        </div>
      )}
    </div>
  );
};

function NextArrow({
  currentSlide,
  slideCount,
  onClick,
}: {
  currentSlide: number;
  slideCount: number;
  onClick?: () => void;
}) {
  const isDisabled = currentSlide === slideCount - 1;
  return (
    <div
      className={`p-1.5 md:p-2 xl:p-3 rounded-full ${isDisabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-primary cursor-pointer"
        } absolute top-[25%] -right-5 md:-right-10 xl:-right-14 group`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <FaArrowRight className="text-sm text-white md:text-lg xl:text-xl group-hover:text-secondary" />
    </div>
  );
}

function PrevArrow({
  currentSlide,
  onClick,
}: {
  currentSlide: number;
  onClick?: () => void;
}) {
  const isDisabled = currentSlide === 0;
  return (
    <div
      className={`p-1.5 md:p-2 xl:p-3 rounded-full ${isDisabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-primary cursor-pointer"
        } absolute top-[25%] -left-5 md:-left-10 xl:-left-14 group`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <FaArrowLeft className="text-sm text-white md:text-lg xl:text-xl group-hover:text-secondary" />
    </div>
  );
}
