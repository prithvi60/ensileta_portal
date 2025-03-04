import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePDFJS } from "@/hooks/usePdfJS";
import { FaArrowLeft, FaArrowRight, FaCircleArrowUp } from "react-icons/fa6";
import Slider from "react-slick";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import Loader2 from "../Loader2";
import { useSession } from "next-auth/react";

// Global fullscreen API declarations
declare global {
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
  }
  interface Document {
    webkitExitFullscreen?: () => Promise<void>;
    webkitFullscreenElement?: Element;
  }
}

// =============================================================================
// ModernCarousel Component
// =============================================================================
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
  createMarkerGroup: (markers: Array<Marker[]>) => void;
  userId: number;
  markerData: string | null;
  fileType: string;
}) {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(idx);
  const [imgs, setImgs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest";

  usePDFJS(async (pdfjs) => {
    try {
      setLoading(true);
      if (!pdf) throw new Error("PDF URL is undefined or empty");

      const response = await fetch(pdf);
      if (!response.ok) throw new Error("PDF file not found");

      const pdfData = await response.arrayBuffer();
      const pdfDocument = await pdfjs.getDocument(new Uint8Array(pdfData)).promise;
      const imgArray: string[] = [];
      const scale = 6; // Higher scale for better quality

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (context) {
          // Disable smoothing for crisp output
          context.imageSmoothingEnabled = false;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          imgArray.push(canvas.toDataURL());
        }
      }
      setImgs(imgArray);
    } catch (error) {
      console.error("Error loading PDF:", error);
    } finally {
      setLoading(false);
    }
  });

  // Keydown navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [idx]);

  const navigate = (direction: number) => {
    setPrevIdx(idx);
    setIdx((prev) => prev + direction);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    if (e.pointerType === "touch" || e.pointerType === "mouse") {
      e.preventDefault();
    }
  };

  const trend = idx > prevIdx ? 1 : -1;
  const imageIndex = imgs.length > 0 ? Math.abs(idx % imgs.length) : 0;

  return (
    <div className="h-[250px] 2xl:h-[390px] bg-black relative w-full max-w-6xl mx-auto overflow-hidden">
      {/* Left Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="bg-primary hover:bg-primary/50 transition-colors text-white p-2 absolute z-10 left-0 top-0 bottom-0"
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 1024 1024"
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
            fill="#fafafa"
          />
        </svg>
      </button>
      {/* Right Arrow */}
      <button
        onClick={() => navigate(1)}
        className="bg-primary hover:bg-primary/50 transition-colors text-white p-2 absolute z-10 right-0 top-0 bottom-0"
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 1024 1024"
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M256 120.768l50.432-56.768L768 512l-461.568 448-50.432-56.768L659.072 512z"
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
              alt="image"
              style={{
                y: "-50%",
                x: "-50%",
                imageRendering: "crisp-edges",
              }}
              className="aspect-square max-h-[90%] max-w-[calc(100%_-_80px)] mx-auto bg-black shadow-2xl absolute left-1/2 top-1/2"
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={handlePointerDown}
              draggable="false"
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
                alt="image"
                style={{ y: "-50%", x: "-50%" }}
                className="aspect-video max-h-[90%] max-w-[calc(100%_-_80px)] mx-auto bg-black object-contain shadow-2xl absolute left-1/2 top-1/2"
                onContextMenu={(e) => e.preventDefault()}
                onPointerDown={(e) => handlePointerDown(e)}
                draggable="false"
              />
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 z-[10] pointer-events-none" />
      <AnimatePresence custom={trend}>
        {loading ? (
          <div className="p-2 rounded-lg absolute z-20 left-10 bottom-4 bg-white/10 backdrop-blur-lg shadow-lg">
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
            {version === 0 ? "Your document will show here after upload" : `Version: ${version}`}
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

// =============================================================================
// Framer Motion Variants
// =============================================================================
const imgVariants = {
  initial: (trend: number) => ({
    x: trend === 1 ? "200%" : "-200%",
    opacity: 0,
  }),
  animate: { x: "-50%", opacity: 1 },
  exit: (trend: number) => ({
    x: trend === 1 ? "-200%" : "200%",
    opacity: 0,
  }),
};

const titleVariants = {
  initial: (trend: number) => ({
    y: trend === 1 ? 20 : -20,
    opacity: 0,
  }),
  animate: { y: 0, opacity: 1 },
  exit: (trend: number) => ({
    y: trend === 1 ? -20 : 20,
    opacity: 0,
  }),
};

// =============================================================================
// SpringModal Component with Zoom, Panning, and Always Visible Arrows
// =============================================================================
interface SpringModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  createMarkerGroup: (markers: Array<Marker[]>) => void;
  markerData: string | null;
  images: string[];
  userName: string;
  userId: number;
  id: number;
  fileType: string;
}

const SpringModal: React.FC<SpringModalProps> = ({
  isOpen,
  setIsOpen,
  createMarkerGroup,
  markerData,
  images,
  userName,
  userId,
  id,
  fileType,
}) => {
  const [isMarkerEnabled, setIsMarkerEnabled] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [markers, setMarkers] = useState<Array<Array<Marker & { comment?: string }>>>(
    Array.from({ length: images.length }, () => [])
  );
  // New zoom state (persisting across slides)
  const [zoom, setZoom] = useState<number>(1);
  const sliderRef = useRef<Slider | null>(null);
  const { data: session } = useSession();

  // Load markers from markerData if provided
  useEffect(() => {
    if (markerData) {
      const parsedMarkers: Marker[][] = JSON.parse(markerData);
      setMarkers(parsedMarkers);
    }
  }, [markerData]);

  const handleSliderChange = (newIndex: number) => {
    setIndex(newIndex);
  };

  // Zoom control functions with increased max zoom (3.6)
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3.6));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1));

  const handleAddMarker = (
    imageIndex: number,
    marker: Marker,
    comment: string,
    user: string,
    userId: number
  ) => {
    const newMarker = { ...marker, comment, user, userId };
    setMarkers((prevMarkers) => {
      const updatedMarkers = [...prevMarkers];
      const filteredMarkers = updatedMarkers[imageIndex]?.filter((m) => m.top !== newMarker.top) || [];
      updatedMarkers[imageIndex] = [...filteredMarkers, newMarker];
      return updatedMarkers;
    });
  };

  const handleClose = async () => {
    try {
      await createMarkerGroup(markers);
    } finally {
      setIsOpen(false);
    }
  };

  // Slider settings without built-in arrows
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: handleSliderChange,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="bg-black/90 backdrop-blur p-8 fixed inset-0 z-[1001] grid place-items-center overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            className="text-white p-6 w-full max-w-7xl relative"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Scrollable container for panning */}
            <div style={{ width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}>
              <div
                className="slider-container"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                  width: "100%",
                }}
              >
                <Slider {...settings} ref={sliderRef}>
                  {images.map((src, idx) => (
                    <div key={idx}>
                      <div style={{ imageRendering: "crisp-edges" }}>
                        <ImageMarker
                          src={src}
                          markers={markers[idx] || []}
                          onAddMarker={(marker: Marker) =>
                            handleAddMarker(idx, marker, "", userName, userId)
                          }
                          markerComponent={(props) => (
                            <CustomMarker
                              {...props}
                              onAddComment={(marker, comment) =>
                                handleAddMarker(idx, marker, comment, userName, userId)
                              }
                              markers={markers[idx] || []}
                            />
                          )}
                          extraClass={`cursor-crosshair ${!isMarkerEnabled ? "pointer-events-none" : ""}`}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
              {/* Always-visible custom arrow buttons */}
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 z-50 p-2 bg-primary text-white rounded-full"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 z-50 p-2 bg-primary text-white rounded-full"
              >
                <FaArrowRight />
              </button>
            </div>
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex space-x-2 z-50">
              <button
                onClick={zoomOut}
                className="px-3 py-1 bg-secondary text-white rounded hover:bg-primary transition-colors"
              >
                -
              </button>
              <button
                onClick={zoomIn}
                className="px-3 py-1 bg-secondary text-white rounded hover:bg-primary transition-colors"
              >
                +
              </button>
            </div>
          </motion.div>
          <div className="fixed top-0 left-0 flex">
            <div className="p-2 text-white bg-secondary">
              {index + 1} / {images.length}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="bg-secondary hover:bg-primary transition-colors text-white p-2 ml-4"
            >
              Close Screen
            </button>
          </div>
          {fileType !== "viewboq" && (
            <div className="fixed top-0 right-0 flex bg-white" onClick={(e) => e.stopPropagation()}>
              {isMarkerEnabled && (
                <div className="text-black text-sm p-2 text-justify items-center flex">
                  Click anywhere to add comment. Please Enter/ click Arrow button to save.
                </div>
              )}
              <button
                type="button"
                className="cursor-pointer w-max p-4 shadow-md select-none bg-secondary text-white hover:bg-primary"
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

// =============================================================================
// CustomMarker Component with Inverse Scaling for Marker Size
// =============================================================================
const CustomMarker = ({
  onAddComment,
  markers,
  top,
  left,
}: MarkerComponentProps & {
  onAddComment: (marker: Marker, comment: string) => void;
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
    const existingMarker = markers.find((marker: { top: number }) => marker.top === top);
    if (existingMarker) {
      setInputValue(existingMarker.comment || "");
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addComment();
    }
  };

  const handleBtn = () => {
    addComment();
  };

  const handleBlur = () => {
    addComment();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (inputRef.current && inputValue) {
      inputRef.current.blur();
    }
  };

  // Inverse scale marker content so it stays consistent in size (adjust factor as needed)
  return (
    <div style={{ transform: `scale(${1})`, transformOrigin: "top left" }}>
      <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave} className="relative">
        {isHovered ? (
          <div className="relative bg-primary bg-opacity-30 rounded-lg p-2">
            <label className="mb-.5 block font-extrabold text-white drop-shadow-lg">
              {user}
            </label>
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
                placeholder="Add comments"
                className="scrollbar-hidden z-1000 w-full rounded-lg border bg-white border-stroke bg-transparent py-2 pl-2 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none mr-8"
                onKeyDown={handleKeyDown}
                rows={1}
              />
              {storedValue.length === 0 && (
                <button className="absolute right-4 top-[42%] transform -translate-y-1/2 cursor-pointer" onClick={handleBtn}>
                  <FaCircleArrowUp size={24} className="text-secondary" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute top-0 left-0 flex items-center">
            <BiSolidMessageRoundedDots className="bg-white rounded-full text-5xl sm:text-6xl text-secondary shadow-md p-2" />
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// NextArrow and PrevArrow (Unused in modal; retained for main carousel)
// =============================================================================
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
      className={`p-1.5 md:p-2 xl:p-3 rounded-full ${
        isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-primary cursor-pointer"
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
      className={`p-1.5 md:p-2 xl:p-3 rounded-full ${
        isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-primary cursor-pointer"
      } absolute top-[25%] -left-5 md:-left-10 xl:-left-14 group`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <FaArrowLeft className="text-sm text-white md:text-lg xl:text-xl group-hover:text-secondary" />
    </div>
  );
}
