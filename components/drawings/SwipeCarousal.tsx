import React, { useState, useRef } from "react";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { motion, AnimatePresence } from "framer-motion";
import { usePDFJS } from "@/hooks/usePdfJS";
import FsLightbox from "fslightbox-react";
import toast from "react-hot-toast";

export default function ModernCarousel({
  pdf,
  version,
  id,
}: {
  pdf: string;
  version: number;
  id: number;
}) {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(idx);
  const [imgs, setImgs] = useState<string[]>([]);
  const [toggle, setToggle] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [lightboxController, setLightboxController] = useState({
    toggler: toggle,
    slide: selectedItem + 1,
  });
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  //   text box related
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  function openLightboxOnSlide(number: number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number + 1,
    });
    setToggle(true);
  }

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

  //   const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
  //     const canvas = canvasRef.current;
  //     if (canvas) {
  //       const rect = canvas.getCanvas().getBoundingClientRect();
  //       const x = e.clientX - rect.left;
  //       const y = e.clientY - rect.top;
  //       setTextPosition({ x, y });
  //       setTextInput("");
  //     }
  //   };

  const handleAddText = () => {
    if (canvasRef.current && textInput && textPosition) {
      canvasRef.current.addText(textInput, {
        fontSize: 20,
        color: "black",
        x: textPosition.x,
        y: textPosition.y,
      });
      setTextPosition(null);
    }
  };

  const trend = idx > prevIdx ? 1 : -1;
  const imageIndex = Math.abs(idx % imgs.length);

  const handleRemarks = () => {
    if (canvasRef.current) {
      canvasRef.current
        .exportImage("png")
        .then((data) => {
        //   console.log(data);
        //   setNewImg(data);
          sendMail(data);
        })
        .catch(() => console.log("error"));
    }
  };

  const sendMail = async (imageurl: string) => {
    // Extract the base64 data (after the comma)
const base64Data = imageurl.split(',')[1];

// Convert base64 to buffer
const imageBuffer = Buffer.from(base64Data, 'base64');
    try {
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // admin email
          recipientEmail: `prithvi@webibee.com`,
          subject: "Update Image by Client",
          message: `
            <p>We need to make these changes </p>
           <img src="cid:unique@image" style="max-width:100%;"/>
          `,
          attachments: [
            {
                filename: 'image.png', // Name of the image
                content: imageBuffer, // The buffer created from the base64 data
                cid: 'unique@image', // Same CID as in the image src above
                contentType: 'image/png' // Content type based on the data URL
            }
        ]
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data) {
        toast.success("Remark sent successfully", {
          position: "top-right",
          duration: 3000,
          style: {
            border: "1px solid #65a34e",
            padding: "16px",
            color: "#65a34e",
          },
          iconTheme: {
            primary: "#65a34e",
            secondary: "#FFFAEE",
          },
        });
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error(error.message, {
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
            />
          ) : (
            <motion.img
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
      <FsLightbox
        exitFullscreenOnClose={true}
        toggler={lightboxController.toggler}
        sources={imgs.map((img) => (
          <div key={img} className="relative">
            <div className="mb-2 gap-2 align-items-center bg-white flex">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                disabled={!eraseMode}
                onClick={() => {
                  setEraseMode(false);
                  canvasRef.current?.eraseMode(false);
                }}
              >
                Draw
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                disabled={eraseMode}
                onClick={() => {
                  setEraseMode(true);
                  canvasRef.current?.eraseMode(true);
                }}
              >
                Eraser
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  // Toggle visibility of text input
                  setTextInput(""); // Reset text input
                  setTextPosition(null); // Clear text position
                }}
              >
                Add Text
              </button>
              <div className="vr" />
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => canvasRef.current?.undo()}
              >
                Undo
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => canvasRef.current?.redo()}
              >
                Redo
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => canvasRef.current?.clearCanvas()}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => canvasRef.current?.resetCanvas()}
              >
                Reset
              </button>
            </div>

            <ReactSketchCanvas
              ref={canvasRef}
              width="50em"
              height="50em"
              backgroundImage={img}
              strokeColor="#65a34e"
              // onClick={handleCanvasClick} // Handle canvas click
            />
            {/* Add text bx manually */}
            {textPosition && (
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Add text on Enter key press
                    handleAddText();
                  }
                }}
                placeholder="Enter text"
                className="absolute" // Position it as needed
                style={{
                  left: textPosition.x,
                  top: textPosition.y,
                }}
              />
            )}
            <div className="mb-2 gap-2 flex w-full relative">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary bg-white mt-2 mx-auto p-5"
                onClick={handleRemarks}
              >
                Send Remarks
              </button>
            </div>
          </div>
        ))}
        type="image"
        slide={lightboxController.slide}
        onClose={() => {
          setToggle(false);
        }}
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
