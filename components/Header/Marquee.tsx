import { motion } from "framer-motion";
import React from "react"

export const Marquee = () => {
    return (
        <DoubleScrollingLogos />
    )
}

export const MarqueeSidebar = () => {
    return (
        <DoubleScrollingLogosSidebar />
    )
}

const DoubleScrollingLogos = () => {
    return (
        <section className="bg-white">
            <div className="flex  overflow-hidden">
                <TranslateWrapper>
                    <LogoItemsTop />
                </TranslateWrapper>
            </div>
        </section>
    );
};

const DoubleScrollingLogosSidebar = () => {
    return (
        <section className="bg-secondary px-5">
            <div className="flex  overflow-hidden">
                <TranslateWrapper>
                    <LogoItemsSidebar />
                </TranslateWrapper>
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
        <img alt="logo" src={img} className="w-12 md:w-16 h-12 md:h-16 flex justify-center items-center" />

    );
};

const LogoItemSidebar = ({ img }: { img: string }) => {
    return (
        <img alt="logo" src={img} className="w-10 md:w-14 h-10 md:h-14 flex justify-center items-center" />

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

const LogoItemsSidebar = () => (
    <>
        <LogoItemSidebar img={"/logo/tcl.svg"} />
        <LogoItemSidebar img={"/logo/kfc.svg"} />
        <LogoItemSidebar img={"/logo/hyundai.svg"} />
        <LogoItemSidebar img={"/logo/valeo.svg"} />
        <LogoItemSidebar img={"/logo/british-airways.svg"} />
        <LogoItemSidebar img={"/logo/tcl.svg"} />
        <LogoItemSidebar img={"/logo/kfc.svg"} />
        <LogoItemSidebar img={"/logo/hyundai.svg"} />
        <LogoItemSidebar img={"/logo/valeo.svg"} />
        <LogoItemSidebar img={"/logo/british-airways.svg"} />
    </>
);

export default DoubleScrollingLogos;