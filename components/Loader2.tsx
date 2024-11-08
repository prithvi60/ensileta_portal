"use client"
import { motion } from "framer-motion";

const Loader2 = () => {
    return (
        <div className="w-full">
            <BarLoader />
        </div>
    );
};

const variants = {
    initial: {
        scaleY: 0.5,
        opacity: 0,
    },
    animate: {
        scaleY: 1,
        opacity: 1,
        transition: {
            repeat: Infinity,
            repeatType: "mirror" as const,
            duration: 1,
            ease: "circIn",
        },
    },
};

const BarLoader = () => {
    return (
        <motion.div
            transition={{
                staggerChildren: 0.25,
            }}
            initial="initial"
            animate="animate"
            className="flex justify-center items-center gap-1"
        >
            <motion.div variants={variants} className="h-6 w-2 bg-white" />
            <motion.div variants={variants} className="h-6 w-2 bg-white" />
            <motion.div variants={variants} className="h-6 w-2 bg-white" />
            <motion.div variants={variants} className="h-6 w-2 bg-white" />
            <motion.div variants={variants} className="h-6 w-2 bg-white" />
        </motion.div>
    );
};

export default Loader2;