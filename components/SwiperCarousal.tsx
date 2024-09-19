import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import pdfjsLib, { getDocument } from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { GoogleAuth } from 'google-auth-library'; // {{ edit_1 }}

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
    type: "spring",
    mass: 3,
    stiffness: 400,
    damping: 50,
};

const ImgData = ["/cover/banner-img.jpg", "/cover/bg-cover.jpg", "/cover/cover-01.png"]

const key = { // {{ edit_2 }}
    "type": "service_account",
    "project_id": "ensileta-files",
    "private_key_id": "aa46bc73a3d6b586ff280de3cfdc6fc1c230913b",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCCnLhtWNP4/y63\nWunxKxkYejvZMlC4fdbqlr/Q01s6Iv2StWSkAF2Eo2A+hWG9gCqAuCv0rKN/td+o\nlYDHxP+D7Zc56XeOL2sBc+TyJ1opCBwF88IuYmdHuD+ugblFh0gaC1LXKdg8TZCW\nwSi1H7Ft0HGUFcJUg0kAoyh7wystfKVMZwUTbcDWsdCN7sAtrmPKD7eUFm/bqkxC\n48cxPaFB7VJ/nW2d29DucPJIbYRkeXPI5LuJbc4R4yTcqzZ5jjkrVHjVsOqfyNuw\nSueGDw+dBJp9RkLU43iqgw/OB6wUlgDJpohyp4SU95nbEE64k9+DRLqCucNk+943\n2HmNyu35AgMBAAECggEABzDqPYj5uLiSAaHVhgPtsImQUHvC8nlpMwbEPlLYr7l7\n9Q8cIKRtga8+Dgspb7XGAUrCjsjPgqlIjF9Y1QbdW43h+NwIC1HEhjKzjPqKLf6m\njlRWoVelII9+IBU/1lplp5tufu6sm1tY5dfyLhC149opWrIc/iqxQwH4qWG8N5eU\nXpvLLDxCt5sTRW4iKNmea1xhenJg7wAeIhkZ805rByvV6u0IRcae5bPwAb0tPL0m\nVT1H/8IolnwURln9wOp/eXpp6d9LQXT4HFmdrr50jchkeIlo8bqRRjUR2Xn7P1hv\nOl8KcYaXtccox3G5MS/ZMGgLor8e2UYifCx6ew2A4QKBgQC3Jenv84BpAz2NWNRP\nWDxIzStXcMsltZsp37HIRqLvnVwZvosp6mhsXC2VcPpOdAVE+E/RsAT2ic3vWIm7\nQqijy9lPuvlRPyMmxoCdLAOgCwx43rXNCMI4zxr4LTLGz3MsaVddIaopsAd+h3P3\nQ6BFp3z/0trdoVjy+lnHY5KMCQKBgQC2kQqtAXWe7QcwGqn7IZ/rRsOAl2BDb1Pb\nMW0OlblESX8tPfG8+7y0s9VgqQlkheEjEBulQcgHv6i+7juwd8d0s+99BCQNd4w2\nsN+XJU1qIDB7X9GcJyfvpeMT2NJuleFbTHE81f9y9HwjKLje+ZG39UUA7Ez3ppWL\nYnYwXMWucQKBgQC0wvPYgyGLA8q9dh3dzf158R3E6KtoJYzmUEUcoTLxggND2X9q\nuFOmF3haFa7GvdXxk47cK3lKhwo9H8qYixr8xxZNjgHCgalE/Qg1mBpf3GfL6CvR\nGMLw5N/+cEW8WUWYYMP8RFy5VmafKDt5oUJPXRaPO+IOes/ayOLRW2JpWQKBgGJL\n2amovYGiMVqPILJcOlRdN2oHFwd363h7NjLCHoxL3jOnxH5yM/o/UUXH/YyoIL3W\nMGxb7K1vXhXfAzhSZYvKTcnL7vVpRo8z0E77AKGBT1k+EAe5dWEsugS3myV7gWi8\n0cNlnTJxvFzZ0iAL049ueYaztAUrJh10GBqV+MGhAoGASgXp1QhmvKwL8mhOqp1a\nJ6+qbsXOJT9hzkZQ2mlZ8+eO4V9rAfSBdKow345jqHFIrOYLcIg2dJ5LPlTagACr\nGs07uLSaSpWzShktfHBQO7HQLHzobnb5HA2B634vKv5LKt6I2r4HBLzjpzOesOTK\n9ql+eXWw2YHrO03Nn2brvbQ=\n-----END PRIVATE KEY-----\n",
    "client_email": "ensileta@ensileta-files.iam.gserviceaccount.com",
    "client_id": "115663521354575558815",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ensileta%40ensileta-files.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}; // {{ edit_2 }}

export const SwipeCarousel = ({ pdf }: { pdf: any }) => {
    const [imgIndex, setImgIndex] = useState(0);
    const [imgs, setImgs] = useState<string[]>([]);
    const dragX = useMotionValue(0);

    useEffect(() => {
        const loadPdf = async () => {
            try {
                // const auth = new GoogleAuth({
                //     credentials: key,
                //     scopes: ["https://www.googleapis.com/auth/cloud-platform"],
                // });
                // const client = await auth.getClient();
                // const url = "https://drive.google.com/uc?id=1H2mgx8Aoh_IhE3hIpB_whwX4226vQvYw";
                // const response = await fetch(url);

                // Set response type to arraybuffer to get binary data
                // const response = await client.request({
                //     url,
                //     responseType: "arraybuffer",
                // });
                // const arrayBuffer = response.data as ArrayBuffer;
                // console.log(response);
                // const response = await customFetch(url, {
                //     responseType: 'arraybuffer',
                // });
                const url = "https://drive.google.com/uc?id=1H2mgx8Aoh_IhE3hIpB_whwX4226vQvYw";
                const response = await fetch(url);
                const data = await response.arrayBuffer();


                // Use pdf.js to load and render the PDF
                // const loadingTask = getDocument(arrayBuffer);
                const loadingTask = pdfjsLib.getDocument(new Uint8Array(data));

                const pdf = await loadingTask.promise;
                const imgArray: string[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
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
        };

        loadPdf();
    }, [pdf]);


    console.log("imgs", imgs)


    const onDragEnd = () => {
        const x = dragX.get();

        if (x <= -DRAG_BUFFER && imgIndex < ImgData.length - 1) {
            setImgIndex((pv) => pv + 1);
        } else if (x >= DRAG_BUFFER && imgIndex > 0) {
            setImgIndex((pv) => pv - 1);
        }
    };

    return (
        <div className="relative w-full overflow-hidden bg-neutral-950 py-1.5  rounded-lg">
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x: dragX }}
                animate={{ translateX: `-${imgIndex * 100}%` }}
                transition={SPRING_OPTIONS}
                onDragEnd={onDragEnd}
                className="flex cursor-grab items-center active:cursor-grabbing"
            >
                <Images imgIndex={imgIndex} imgs={ImgData.length > 0 ? ImgData : [""]} />
            </motion.div>

            <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} imgs={ImgData.length > 0 ? ImgData : [""]} />
            <GradientEdges />
        </div>
    );
};

const Images = ({ imgIndex, imgs }: { imgIndex: number; imgs: string[] }) => {
    return (
        <>
            {imgs.map((imgSrc, idx) => (
                <motion.div
                    key={idx}
                    style={{
                        backgroundImage: `url(${imgSrc})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    animate={{ scale: imgIndex === idx ? 0.95 : 0.85 }}
                    transition={SPRING_OPTIONS}
                    className="aspect-[4/2] lg:aspect-[4/1.5] w-full shrink-0 rounded-xl bg-neutral-800 object-cover"
                />
            ))}
        </>
    );
};

const Dots = ({
    imgs,
    imgIndex,
    setImgIndex,
}: {
    imgs: any;
    imgIndex: number;
    setImgIndex: Dispatch<SetStateAction<number>>;
}) => {
    return (
        <div className="mt-2 flex w-full justify-center gap-2">
            {imgs.map((_: any, idx: number) => (
                <button
                    key={idx}
                    onClick={() => setImgIndex(idx)}
                    className={`size-2 md:size-3 rounded-full transition-colors ${idx === imgIndex ? "bg-[#139F9B]" : "bg-neutral-500"}`}
                />
            ))}
        </div>
    );
};

const GradientEdges = () => {
    return (
        <>
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
        </>
    );
};