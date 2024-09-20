"use client"
import React, { useEffect, useState } from "react";
// import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

// const isClient = typeof window !== "undefined";

export const BasicFAQ = () => {
    return (
        <div className="px-4 py-12">
            <div className="mx-auto max-w-3xl">
                <h3 className="mb-4 text-center text-3xl font-semibold">
                    Frequently asked questions
                </h3>
                <Question title="What services does Ensileta Interior Company provide?" defaultOpen>
                    <p>
                        We offer a wide range of interior design services, including residential design, commercial space planning, custom furniture design, kitchen and bathroom remodeling, lighting design, and more. Our goal is to create personalized spaces that reflect your style and meet your functional needs.
                    </p>
                </Question>
                <Question title="How does the design process work at Ensileta?">
                    <p>
                        Our process begins with a consultation where we understand your vision, preferences, and budget. After that, we present design concepts, materials, and color schemes. Once the design is finalized, we manage the entire project from sourcing materials to overseeing installation, ensuring a seamless experience.
                    </p>
                </Question>
                <Question title="How long does a typical interior design project take?">
                    <p>
                        The timeline for a project varies depending on its size and complexity. For smaller projects, such as a single room, it may take 4-6 weeks. Larger projects like a full home or commercial space can take several months. We’ll provide a detailed project timeline after the initial consultation.
                    </p>
                </Question>
                <Question title="How do you determine the cost of a project?">
                    <p>
                        The cost of a project depends on various factors, including the scope of work, materials chosen, and the size of the space. After our initial consultation, we will provide a detailed estimate outlining the costs for design, materials, and labor.
                    </p>
                </Question>
                <Question title="Do you offer sustainable or eco-friendly design options?">
                    <p>
                        Yes, we are committed to offering eco-friendly and sustainable design solutions. We work with suppliers who provide environmentally conscious materials and offer energy-efficient design options wherever possible.
                    </p>
                </Question>
            </div>
        </div>
    );
};

const Question = ({
    title,
    children,
    defaultOpen = false,
}: {
    title: string;
    children: JSX.Element;
    defaultOpen?: boolean;
}) => {
    const [ref, { height }] = useMeasure();
    const [open, setOpen] = useState(defaultOpen);

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <motion.div
            animate={open ? "open" : "closed"}
            className="border-b-[1px] border-b-slate-300"
        >
            <button
                onClick={() => setOpen((pv) => !pv)}
                className="flex w-full items-center justify-between gap-4 py-6"
            >
                <motion.span
                    variants={{
                        open: {
                            color: "rgba(3, 6, 23, 0)",
                        },
                        closed: {
                            color: "rgba(3, 6, 23, 1)",
                        },
                    }}
                    className="bg-success bg-clip-text text-left text-lg font-medium"
                >
                    {title}
                </motion.span>
                <motion.span
                    variants={{
                        open: {
                            rotate: "180deg",
                            color: "rgb(124 58 237)",
                        },
                        closed: {
                            rotate: "0deg",
                            color: "#030617",
                        },
                    }}
                >
                    {/* <FiChevronDown className="text-2xl" /> */}
                    <svg width="15px" height="15px" viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000" />
                    </svg>
                </motion.span>
            </button>
            {hasMounted && (
                <motion.div
                    initial={false}
                    animate={{
                        height: open ? height : "0px",
                        marginBottom: open ? "24px" : "0px",
                    }}
                    className="overflow-hidden text-slate-600"
                >
                    <div ref={ref}>{children}</div>
                </motion.div>
            )}
        </motion.div>
    );
};
