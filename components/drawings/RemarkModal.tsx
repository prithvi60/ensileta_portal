"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { GiVirtualMarker } from "react-icons/gi";
import Slider from "react-slick";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import { FaCircleArrowUp } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { usePDFJS } from "@/hooks/usePdfJS";
// interface MarkerProps {
//     top: number;
//     left: number;
//     itemNumber: number;
//     marker: string;
// }

const RemarkModal = ({
  handleSave,
  pdf,
  handleSendEmail,
  isApproved,
  isApproving,
}: {
  handleSave: any;
  pdf: string;
  handleSendEmail: any;
  isApproved: any;
  isApproving: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [imgs, setImgs] = useState<string[]>([]);
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
  return (
    <section>
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer w-max p-4 shadow-md select-none bg-secondary text-white hover:bg-primary"
        >
          Remarks
        </button>
        <SpringModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleSave={handleSave}
          images={imgs}
          handleSendEmail={handleSendEmail}
          isApproved={isApproved}
          isApproving={isApproving}
        />
      </div>
    </section>
  );
};

const SpringModal = ({
  isOpen,
  setIsOpen,
  handleSave,
  images,
  handleSendEmail,
  isApproved,
  isApproving,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  handleSave: any;
  images: string[];
  handleSendEmail: any;
  isApproved: any;
  isApproving: any;
}) => {
  const [markers, setMarkers] = useState<Array<Marker & { comment?: string }>>([
    // Update from DB
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
  ]);
  // console.log("markers", markers);
  const handleAddMarker = (marker: Marker, comment: string) => {
    // console.log("new",marker)
    // const latestcomment = comment === "" ? "nil" : comment;
    const newMarker = { ...marker, comment: comment };
    setMarkers((prevMarkers) => {
      const filteredMarkers = prevMarkers.filter(
        (m) => m.top !== newMarker.top
      );
      return [...filteredMarkers, newMarker];
    });
  };
  const handleClose = () => {
    setIsOpen(false);
    handleSave();
  };
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 3000,
    // speed: 1000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="bg-black/90 backdrop-blur p-8 fixed inset-0 z-[1001] grid place-items-center cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="text-white p-6 w-full max-w-7xl relative h-full"
          >
            <div className="slider-container">
              <Slider {...settings}>
                {images.map((src, idx) => {
                  return (
                    <ImageMarker
                      key={idx}
                      src={src}
                      markers={markers}
                      onAddMarker={(marker: Marker) =>
                        handleAddMarker(marker, "")
                      } // Pass empty comment initially
                      markerComponent={(props) => (
                        <CustomMarker
                          {...props}
                          onAddComment={handleAddMarker}
                          markers={markers}
                        />
                      )}
                      extraClass="cursor-crosshair"
                    />
                  );
                })}
              </Slider>
            </div>
            <div className="absolute top-4 right-0 bg-white">
              <div className="text-black">
                Please click approve if the drawing is good to go!
              </div>
              <button
                disabled={isApproved || isApproving}
                type="submit"
                className=" cursor-pointer w-full sm:w-1/2 p-4 shadow-md select-none bg-secondary text-white hover:bg-primary disabled:bg-opacity-70 disabled:cursor-not-allowed"
                onClick={handleSendEmail}
              >
                {isApproving
                  ? "Approving..."
                  : isApproved
                  ? "Approved"
                  : `Approve`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RemarkModal;

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
