"use client";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export const MarqueeSb = () => {
    return (
        <Marquee pauseOnHover autoFill>
            <div className="flex items-center">
                {CompaniesLogo.map((item, idx) => (
                    <div key={idx} className="relative mx-4 size-12">
                        <Image fill alt={item.logoName} src={item.logo} className="object-contain object-center" />
                    </div>
                ))}
            </div>
        </Marquee>
    )
}

const MarqueeComponent = ({ logo, logoName }: any) => {
    return (
        <Marquee autoFill>
            <div className="size-6">
                <Image fill alt={logoName} src={logo} className="object-contain object-center" />
            </div>
        </Marquee>

    );
};



const CompaniesLogo = [
    { logoName: "tcl", logo: "/logo/tcl.svg" },
    { logoName: "kfc", logo: "/logo/kfc.svg" },
    { logoName: "hyundai", logo: "/logo/hyundai.svg" },
    { logoName: "valeo", logo: "/logo/valeo.svg" },
    { logoName: "british airways", logo: "/logo/british-airways.svg" },

];
