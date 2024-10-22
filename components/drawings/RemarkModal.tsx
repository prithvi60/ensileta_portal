"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { GiVirtualMarker } from "react-icons/gi";
import Slider from "react-slick";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";

// interface MarkerProps {
//     top: number;
//     left: number;
//     itemNumber: number;
//     marker: string;
// }

const RemarkModal = ({ handleSave }: { handleSave: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <section>
            <div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="cursor-pointer w-max p-4 shadow-md select-none bg-secondary text-white hover:bg-primary"
                >
                    Remarks
                </button>
                <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} handleSave={handleSave} />
            </div>
        </section>
    );
};

const SpringModal = ({
    isOpen,
    setIsOpen,
    handleSave
}: {
    isOpen: boolean;
    setIsOpen: Function;
    handleSave: any
}) => {
    const [markers, setMarkers] = useState<Array<Marker & { comment?: string }>>([
        // Add comment field to Marker type
    ]);
    // console.log("markers", markers);
    const handleAddMarker = (marker: Marker, comment: string) => {
        const newMarker = { ...marker, comment };
        setMarkers([...markers, newMarker]);
    };
    const handleClose = () => {
        setIsOpen(false)
        handleSave()
    }
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
                        className="text-white p-6 w-full max-w-7xl relative h-max md:h-auto"
                    >
                        <div className="slider-container">
                            <Slider {...settings}>
                                <ImageMarker
                                    src="/cover/banner-img.jpg"
                                    markers={markers}
                                    onAddMarker={(marker: Marker) => handleAddMarker(marker, "")} // Pass empty comment initially
                                    markerComponent={(props) => (
                                        <CustomMarker {...props} onAddComment={handleAddMarker} />
                                    )}
                                    extraClass="cursor-crosshair w-full h-[80vh]"

                                />
                                <ImageMarker
                                    src="/cover/bg-cover.jpg"
                                    markers={markers}
                                    onAddMarker={(marker: Marker) => handleAddMarker(marker, "")} // Pass empty comment initially
                                    markerComponent={(props) => (
                                        <CustomMarker {...props} onAddComment={handleAddMarker} />
                                    )}
                                    extraClass="cursor-crosshair w-full h-[80vh]"
                                />
                                {/* <ImageMarker
                                    src="/cover/cover-01.png"
                                    markers={markers}
                                    onAddMarker={(marker: Marker) => handleAddMarker(marker, "")} // Pass empty comment initially
                                    markerComponent={(props) => (
                                        <CustomMarker {...props} onAddComment={handleAddMarker} />
                                    )}
                                    extraClass="cursor-crosshair"
                                /> */}
                                {/* <div className="relative w-full h-[85vh]">
                                    <Image
                                        alt="img"
                                        src={"/cover/banner-img.jpg"}
                                        fill
                                        className="object-cover object-center"
                                    />
                                </div> */}
                            </Slider>
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
    ...props
}: MarkerComponentProps & {
    onAddComment: (marker: Marker, comment: string) => void;
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // const YourComponent: React.FC<MarkerProps> = (props) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputRef.current) {
            onAddComment(props.marker, inputValue); // Pass the comment back to the Page component
            inputRef.current.blur();
        }
        // };
    };
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative"
        >
            {isHovered ? (
                // true
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add comments"
                    className="z-1000 w-full rounded-lg border bg-white border-stroke bg-transparent py-2 pl-2 pr-2 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <div className="absolute top-0 left-0 flex items-center">
                    <GiVirtualMarker className="text-4xl sm:text-5xl text-white shadow-md" />
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
