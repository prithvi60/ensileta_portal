import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePDFJS } from "@/hooks/usePdfJS";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { GiVirtualMarker } from "react-icons/gi";
import Slider from "react-slick";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import { FaCircleArrowUp } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
export default function ModernCarousel({
  pdf,
  version,
  id,
  handleSendEmail,
  isApproved,
  isApproving,
  createMarkerGroup,
  userId,
  markerData,
  fileType
}: {
  pdf: string;
  version: number;
  id: number;
  createMarkerGroup: any;
  handleSendEmail: any;
  isApproved: any;
  isApproving: any;
  userId: number;
  markerData: any;
  fileType: string
}) {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(idx);
  const [imgs, setImgs] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  usePDFJS(async (pdfjs) => {
    try {
      const url = pdf;
      const response = await fetch(url);
      const data = await response.arrayBuffer();
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
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  });

  const trend = idx > prevIdx ? 1 : -1;
  const imageIndex = Math.abs(idx % imgs.length);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Unknown";

  return (
    <div className="h-[30vw] min-h-[200px] max-h-[400px] bg-black relative overflow-hidden">
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
            />
          ) : (
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
            />
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
  fileType
}: {
  isOpen: boolean;
  setIsOpen: Function;
  createMarkerGroup: any;
  images: string[];
  userName: string;
  userId: number;
  id: number;
  markerData: any;
  fileType: string
}) => {
  const [isMarkerEnabled, setIsMarkerEnabled] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [IsChanged, setIsChanged] = useState<boolean>(false);

  // if (data) {
  //   const parse = JSON.parse(data?.getMarkerGroupById.data)
  //   // setMarkers()
  //   console.log("get", parse);
  // }

  const [markers, setMarkers] = useState<
    Array<Array<Marker & { comment?: string }>>
  >(
    Array.from(
      { length: images.length },
      (_, index) => (index === 0 ? [] : []) // Other arrays remain empty
    )
  );

  useEffect(() => {
    if (markerData) {
      const parsedMarkers = JSON.parse(markerData);
      setMarkers(parsedMarkers);
      // console.log("Markers set from data:", parsedMarkers);
    }
  }, [markerData]);

  const handleSliderChange = (newIndex: number) => {
    setIndex(newIndex); // Update the index when the slider changes
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
      setIsOpen(false); // Close the modal
      toggleFullScreen()

    }
  };

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 3000,
    // speed: 1000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  const toggleFullScreen = () => {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };
  useEffect(() => {
    if (isOpen) {

      toggleFullScreen()
    }
  }, [isOpen])
  // const parse = JSON.stringify(markers)
  // console.log("markers",);
  // console.log("markers parse", { markers, IsChanged });
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
            className="text-white p-6 w-full max-w-7xl relative h-full"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()} // Disable right-click
          >
            <div className="slider-container">
              <Slider {...settings} afterChange={handleSliderChange}>
                {images.map((src, idx) => {
                  return (
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
                          setIsChanged={setIsChanged}
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
                          markers={markers[idx] || []} // Pass markers for the current image
                        />
                      )}
                      extraClass={`cursor-crosshair ${!isMarkerEnabled ? "pointer-events-none" : ""
                        }`}
                    />
                  );
                })}
              </Slider>
            </div>
          </motion.div>
          <div className="fixed top-0 left-0 flex" >
            <div className="p-2 text-white bg-secondary">
              {index + 1} / {images.length}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                handleClose()
              }}
              className="bg-secondary hover:bg-primary transition-colors text-white p-2 ml-4"
            >
              Close Screen
            </button>
          </div>
          {fileType !== "viewboq" && (<div
            className="fixed top-0 right-0 flex bg-white"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
            }}
          >
            {isMarkerEnabled && (
              <div className="text-black text-sm p-2 text-justify items-center flex">
                Click anywhere to add comment. Please Enter/ click Arrow button to save.
              </div>
            )}
            <button
              type="submit"
              className="cursor-pointer w-max-xontent  p-4 shadow-md select-none bg-secondary text-white hover:bg-primary"
              onClick={(e) => {
                e.stopPropagation();
                setIsMarkerEnabled((o) => !o);
              }}
            >
              {isMarkerEnabled ? "Close Remarks" : "Add Remarks"}
            </button>
          </div>)}

        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CustomMarker = ({
  onAddComment,
  markers,
  top,
  left,
  setIsChanged,
}: MarkerComponentProps & {
  onAddComment: (marker: Marker, comment: string) => void;
  markers: any;
  setIsChanged: Function;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [storedValue, setStoredValue] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Unknown";
  const [user, setUser] = useState<string>(userName);
  // console.log("custom marker",markers)
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
  // @ts-ignore
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      setIsChanged(0);
      const marker = { top, left };
      onAddComment(marker, inputValue); // Pass the comment back to the Page component
      setIsHovered(false);
      //   console.log("val", inputValue);
    } else {
      setIsChanged(false);
    }
  };

  const handleBtn = () => {
    if (inputRef.current) {
      setIsChanged(true);
      const marker = { top, left };
      onAddComment(marker, inputValue); // Pass the comment back to the Page component
      setIsHovered(false);
      //   console.log("val", inputValue);
    } else {
      setIsChanged(false);
    }
  };
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {isHovered ? (
        <div className="relative bg-primary bg-opacity-30 rounded-lg p-2">
          <label className="mb-.5 block font-extrabold text-white drop-shadow-lg">{user}</label>
          <div className="relative">
            <textarea
              ref={inputRef}
              disabled={storedValue.length > 0}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <div
      className={
        "p-1.5 md:p-2 xl:p-3 rounded-full bg-primary absolute top-[25%] cursor-pointer -right-5 md:-right-10 xl:-right-14 group"
      }
      onClick={onClick}
    >
      <FaArrowRight className="text-sm text-white md:text-lg xl:text-xl group-hover:text-secondary" />
    </div>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <div
      className={
        "p-1.5 md:p-2 xl:p-3 rounded-full bg-primary absolute top-[25%] cursor-pointer -left-5 md:-left-10 xl:-left-14 group"
      }
      onClick={onClick}
    >
      <FaArrowLeft className="text-sm text-white md:text-lg xl:text-xl group-hover:text-secondary" />
    </div>
  );
}

