"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import UploadFile from "./Upload";
import FsLightbox from "fslightbox-react";
import { usePDFJS } from "@/hooks/usePdfJS";
import toast from "react-hot-toast";
import { FaArrowLeft, FaArrowRight, FaCircleArrowUp } from "react-icons/fa6";
import { GiVirtualMarker } from "react-icons/gi";
import Slider from "react-slick";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";

const ModalWrapper = ({
  uploadFile,
  userId,
  email,
  fileType,
  refetchUsers,
}: {
  uploadFile: any;
  userId: number;
  email: string;
  fileType: string;
  refetchUsers: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className={`w-max cursor-pointer py-4 px-10 text-white bg-secondary mb-5 hover:bg-[#0E122B] transition-colors`}
      >
        upload
      </button>
      <SpringModal
        isOpen={isOpen}
        userId={userId}
        setIsOpen={setIsOpen}
        uploadFile={uploadFile}
        email={email}
        fileType={fileType}
        refetchUsers={refetchUsers}
      />
    </div>
  );
};

const SpringModal = ({
  isOpen,
  setIsOpen,
  uploadFile,
  userId,
  email,
  fileType,
  refetchUsers,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  uploadFile: any;
  userId: number;
  email: string;
  fileType: string;
  refetchUsers: any;
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
                Upload File
              </h3>
              <UploadFile
                uploadFile={uploadFile}
                userId={userId}
                setIsOpen={setIsOpen}
                email={email}
                fileType={fileType}
                refetchUsers={refetchUsers}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalWrapper;

export const ModalWrapper2D = ({
  userId,
  uploadFile,
  email,
  refetchUsers,
}: {
  uploadFile: any;
  userId: number;
  email: string;
  refetchUsers: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className={`w-max cursor-pointer py-4 px-10 text-white bg-secondary mb-5 hover:bg-[#0E122B] transition-colors`}
      >
        upload
      </button>
      <SpringModal2D
        isOpen={isOpen}
        userId={userId}
        setIsOpen={setIsOpen}
        email={email}
        refetchUsers={refetchUsers}
        uploadFile={uploadFile}
      />
    </div>
  );
};

const SpringModal2D = ({
  isOpen,
  setIsOpen,
  uploadFile,
  userId,
  email,
  refetchUsers,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  userId: number;
  uploadFile: any;
  email: string;
  refetchUsers: any;
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
                Upload File
              </h3>
              <UploadFile
                uploadFile={uploadFile}
                userId={userId}
                setIsOpen={setIsOpen}
                email={email}
                fileType={""}
                refetchUsers={refetchUsers}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ViewModalWrapper = ({
  pdf,
  markerData,
}: {
  pdf: string;
  markerData: any;
}) => {
  const [toggle, setToggle] = useState(false);
  const [imgs, setImgs] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<string>(pdf);
  const handleClick = () => {
    if (imgs.length !== 0) {
      setToggle(!toggle);
    } else {
      toast.error("First, upload the file", {
        position: "top-right",
        duration: 3000,
        style: {
          border: "1px solid #EB1C23",
          padding: "16px",
          color: "#EB1C23",
        },
        iconTheme: {
          primary: "#EB1C23",
          secondary: "#FFFAEE",
        },
      });
    }
  };
  useEffect(() => {
    // console.log("current pdf",pdf)
    setPdfFile(pdf);
  }, [pdf]);

  usePDFJS(
    async (pdfjs) => {
      try {
        const url = pdfFile;
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
            const imageUrl = canvas.toDataURL();
            imgArray.push(imageUrl);
          }
        }

        if (imgArray.length === 0) {
          throw new Error("No images were generated from the PDF.");
        }

        setImgs(imgArray);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    },
    [pdfFile]
  );

  return (
    <div>
      <button
        // disabled={imgs.length === 0 ? true : false}
        onClick={handleClick}
        className={`w-max cursor-pointer py-4 px-10 text-white bg-secondary mb-5 hover:bg-[#0E122B] transition-colors `}
      >
        View
      </button>
      {/* <FsLightbox
                exitFullscreenOnClose={true}
                toggler={toggle}
                sources={imgs.length > 0 ? imgs : []}
                type="image"
            /> */}
      <SpringModal2
        isOpen={toggle}
        setIsOpen={setToggle}
        markerData={markerData}
        images={imgs.length > 0 ? imgs : []}
      />
    </div>
  );
};

const SpringModal2 = ({
  isOpen,
  setIsOpen,
  markerData,
  images,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  images: string[];
  markerData: any;
}) => {
  const [isMarkerEnabled, setIsMarkerEnabled] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

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
      console.log("Markers set from data:", parsedMarkers);
    }
  }, [markerData]);
  console.log("markers", markers);

  const handleSliderChange = (newIndex: number) => {
    setIndex(newIndex); // Update the index when the slider changes
  };

  const handleClose = () => {
    setIsOpen(false);
    toggleFullScreen()
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
  useEffect(()=>{
    if(isOpen){

      toggleFullScreen()
    }
  },[isOpen])
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="bg-black/90 backdrop-blur p-8 fixed inset-0 z-[1001] grid place-items-center overflow-y-scroll h-screen"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            className="text-white p-6 w-full max-w-7xl relative h-full"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="slider-container">
              <Slider {...settings} afterChange={handleSliderChange}>
                {images.map((src, idx) => {
                  return (
                    <ImageMarker
                      key={idx}
                      src={src}
                      markers={markers[idx] || []}
                      markerComponent={(props) => (
                        <CustomMarker {...props} markers={markers[idx] || []} />
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CustomMarker = ({
  markers,
  top,
}: MarkerComponentProps & { markers: any }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [user, setUser] = useState<string>("");
  useEffect(() => {
    const existingMarker = markers.find(
      (marker: { top: Number }) => marker.top === top
    );
    if (existingMarker) {
      setInputValue(existingMarker.comment || ""); // Set comment if exists
      setUser(existingMarker.user);
    }
  }, [markers, top]);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {isHovered ? (
        <div className="relative">
          <label className="mb-.5 block font-medium text-black">{user}</label>
          <div className="relative">
            <textarea
              value={inputValue}
              disabled
              placeholder="Add comments"
              className=" scrollbar-hidden z-1000 w-full rounded-lg border bg-white border-stroke bg-transparent py-2 pl-2 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none mr-8"
              rows={1}
            />
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
