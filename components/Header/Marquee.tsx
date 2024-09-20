import { motion } from "framer-motion";
import Image from "next/image";

export const Marquee = () => {
    return (
        <DoubleScrollingLogos />
    )
}

const DoubleScrollingLogos = () => {
    return (
        <section className="bg-white">
            <div className="flex  overflow-hidden">
                <TranslateWrapper>
                    <LogoItemsTop />
                </TranslateWrapper>
                {/* <TranslateWrapper>
                    <LogoItemsTop />
                </TranslateWrapper>
                <TranslateWrapper>
                    <LogoItemsTop />
                </TranslateWrapper> */}
            </div>
        </section>
    );
};

const TranslateWrapper = ({
    children,
    reverse,
}: {
    children: JSX.Element;
    reverse?: boolean;
}) => {
    return (
        <motion.div
            initial={{ translateX: reverse ? "-100%" : "0%" }}
            animate={{ translateX: reverse ? "0%" : "-100%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-4 px-2"
        >
            {children}
        </motion.div>
    );
};

const LogoItem = ({ img }: { img: string }) => {
    return (
        // <div className="flex justify-center items-center h-20">
        //     {/* <Image alt="logo" src={img} fill  /> */}
        //     <Image alt="logo" src={img} width={60} height={60} />
        // </div>
        // <Image alt="logo" src={img} width={60} height={60} className="flex justify-center items-center" />

        <img alt="logo" src={img} className="w-12 md:w-16 h-12 md:h-16 flex justify-center items-center" />

    );
};

const LogoItemsTop = () => (
    <>
        <LogoItem img={"/logo/tcl.svg"} />
        <LogoItem img={"/logo/kfc.svg"} />
        <LogoItem img={"/logo/hyundai.svg"} />
        <LogoItem img={"/logo/valeo.svg"} />
        <LogoItem img={"/logo/british-airways.svg"} />
        <LogoItem img={"/logo/tcl.svg"} />
        <LogoItem img={"/logo/kfc.svg"} />
        <LogoItem img={"/logo/hyundai.svg"} />
        <LogoItem img={"/logo/valeo.svg"} />
        <LogoItem img={"/logo/british-airways.svg"} />
    </>
);

export default DoubleScrollingLogos;