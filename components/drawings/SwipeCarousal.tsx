import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePDFJS } from "@/hooks/usePdfJS";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { GiVirtualMarker } from "react-icons/gi";
import Slider from "react-slick";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import { FaCircleArrowUp } from "react-icons/fa6";
import { useSession } from "next-auth/react";
export default function ModernCarousel({
  pdf,
  version,
  id,
  handleSendEmail,
  isApproved,
  isApproving,
  handleSave,
}: {
  pdf: string;
  version: number;
  id: number;
  handleSave: any;
  handleSendEmail: any;
  isApproved: any;
  isApproving: any;
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

  //   const sendMail = async (imageurl: string) => {
  //     // Extract the base64 data (after the comma)
  // const base64Data = imageurl.split(',')[1];
  // // console.log(base64Data);
  // setloadremarks(true)
  //     try {
  //       const response = await fetch("/api/sendMail", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           // admin email
  //           recipientEmail: `prithvi@webibee.com`,
  //           subject: "Update Image by Client",
  //           message: `
  //             <p>We need to make these changes </p>
  //             <img style="width:250px;" src="unique@image">
  //           `,
  //           attachments: [
  //             {
  //                 filename: 'change.png', // Name of the image
  //                 content: base64Data,
  //                 cid: 'unique@image', // Same CID as in the image src above
  //                 contentType: 'image/png', // Content type based on the data URL
  //                 encoding: 'base64'
  //             },
  //             // {
  //             //   filename: 'document.pdf',
  //             //   content: base64PDFData, // The base64 string of the PDF
  //             //   contentType: 'application/pdf', // Set the correct content type for PDFs
  //             //   encoding: 'base64', // Specify base64 encoding
  //             // }
  //         ]
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       setLightboxController({
  //         toggler: !lightboxController.toggler,
  //         slide: 1,
  //       });
  //       const data = await response.json();
  //       if (data) {
  //         setloadremarks(false)
  //         toast.success("Remark sent successfully", {
  //           position: "top-right",
  //           duration: 6000,
  //           style: {
  //             border: "1px solid #65a34e",
  //             padding: "16px",
  //             color: "#65a34e",
  //           },
  //           iconTheme: {
  //             primary: "#65a34e",
  //             secondary: "#FFFAEE",
  //           },
  //         });
  //       }
  //     } catch (error: any) {
  //       console.error("Error sending email:", error);
  //       toast.error(error.message, {
  //         position: "top-right",
  //         duration: 3000,
  //         style: {
  //           border: "1px solid #EB1C23",
  //           padding: "16px",
  //           color: "#EB1C23",
  //         },
  //         iconTheme: {
  //           primary: "#EB1C23",
  //           secondary: "#FFFAEE",
  //         },
  //       });
  //     }
  //   };

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
        handleSave={handleSave}
        images={imgs}
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
  handleSave,
  images,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  handleSave: any;
  images: string[];
}) => {
  const [isMarkerEnabled, setIsMarkerEnabled] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const [markers, setMarkers] = useState<
    Array<Array<Marker & { comment?: string }>>
  >(
    Array.from(
      { length: images.length },
      (_, index) =>
        index === 0
          ? [
              // Only populate the first array with dummy data
              {
                top: 45.12916772715704,
                left: 51.92,
                comment: "change colour",
              },
              {
                top: 64.83901756172054,
                left: 30.24,
                comment: "remove this",
              },
            ]
          : [] // Other arrays remain empty
    )
  );
  const handleSliderChange = (newIndex: number) => {
    setIndex(newIndex); // Update the index when the slider changes
  };
  // Update the handleAddMarker function to accept an image index
  const handleAddMarker = (
    imageIndex: number,
    marker: Marker,
    comment: string
  ) => {
    const newMarker = { ...marker, comment: comment };
    setMarkers((prevMarkers) => {
      const updatedMarkers = [...prevMarkers];
      const filteredMarkers =
        updatedMarkers[imageIndex]?.filter((m) => m.top !== newMarker.top) ||
        [];
      updatedMarkers[imageIndex] = [...filteredMarkers, newMarker];
      return updatedMarkers;
    });
  };
  const handleClose = () => {
    setIsOpen(false);
    handleSave();
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
    const element = document.documentElement; // Get the document element
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
                        (marker: Marker) => handleAddMarker(idx, marker, "") // Pass the current image index
                      }
                      markerComponent={(props) => (
                        <CustomMarker
                          {...props}
                          onAddComment={(marker, comment) =>
                            handleAddMarker(idx, marker, comment)
                          } // Pass the current image index
                          markers={markers[idx] || []} // Pass markers for the current image
                        />
                      )}
                      extraClass={`cursor-crosshair ${
                        !isMarkerEnabled ? "pointer-events-none" : ""
                      }`}
                    />
                  );
                })}
              </Slider>
            </div>
          </motion.div>
          <div className="fixed top-0 left-0 flex bg-white">
            <div>
              {index + 1} / {images.length}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                toggleFullScreen();
              }}
              className="bg-secondary hover:bg-primary transition-colors text-white p-2 ml-4"
            >
              Fullscreen
            </button>
          </div>

          <div
            className="fixed top-0 right-0 flex bg-white"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
            }}
          >
            {isMarkerEnabled && (
              <div className="text-black">
                Click anywhere to type and Enter / use button to comment
              </div>
            )}
            <button
              type="submit"
              className="cursor-pointer w-full  p-4 shadow-md select-none bg-secondary text-white hover:bg-primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                setIsMarkerEnabled((o) => !o);
              }}
            >
              {isMarkerEnabled ? "Close Remarks" : "Add Remarks"}
            </button>
          </div>
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
}: MarkerComponentProps & {
  onAddComment: (marker: Marker, comment: string) => void;
  markers: any;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [storedValue, setStoredValue] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Unknown";
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
    }
  }, [markers, top]);
  // @ts-ignore
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      const marker = { top, left };
      onAddComment(marker, inputValue); // Pass the comment back to the Page component
      setIsHovered(false);
      //   console.log("val", inputValue);
    }
  };

  const handleBtn = () => {
    if (inputRef.current) {
      const marker = { top, left };
      onAddComment(marker, inputValue); // Pass the comment back to the Page component
      setIsHovered(false);

      //   console.log("val", inputValue);
    }
  };
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {isHovered ? (
        <div className="relative">
          <label className="mb-.5 block font-medium text-black">
            {userName}
          </label>
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
        <div className="absolute top-0 left-0 flex items-center">
          <GiVirtualMarker className="text-4xl sm:text-5xl text-secondary shadow-md" />
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
        "p-1.5 md:p-2 xl:p-3 rounded-full bg-primary absolute top-1/2 cursor-pointer -right-5 md:-right-10 xl:-right-14 group"
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
        "p-1.5 md:p-2 xl:p-3 rounded-full bg-primary absolute top-1/2 cursor-pointer -left-5 md:-left-10 xl:-left-14 group"
      }
      onClick={onClick}
    >
      <FaArrowLeft className="text-sm text-white md:text-lg xl:text-xl group-hover:text-secondary" />
    </div>
  );
}
