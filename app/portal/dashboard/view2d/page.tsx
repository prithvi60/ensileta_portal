"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import {
    ADD_2D_FILENAME,
    ADD_MARKERS,
    GET_ALL_2D_VIEW,
    GET_MARKERS,
    GET_USER,
    GET_USERS,
} from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import { GiVirtualMarker } from "react-icons/gi";
interface GetAll2DViewResponse {
    getAll2DFiles: Array<{
        id: number;
        filename: string;
        fileUrl: string;
        version: number;
        userId: number;
        createdAt: string;
    }>;
}

const Page = () => {
    const [uploadFile] = useMutation(ADD_2D_FILENAME);
    const { data } = useQuery<GetAll2DViewResponse>(GET_ALL_2D_VIEW);
    const { data: AllUsers, loading, refetch } = useQuery(GET_USERS);
    const pathname = usePathname();
    const fileType = pathname.split("/").pop();
    const { data: RoleBased } = useQuery(GET_USER);
    const userId = RoleBased?.user?.id;
    const { loading: existingLoading, data: existingMarkers } = useQuery(
        GET_MARKERS,
        {
            variables: { userId },
        }
    );
    const [addMarkers] = useMutation(ADD_MARKERS);
    // console.log(userId);

    //Define the markers
    const [markers, setMarkers] = useState<Array<Marker & { comment?: string }>>([
        // Add comment field to Marker type
    ]);

    console.log("exist", existingMarkers);

    useEffect(() => {
        console.log("Existing markers fetched:", existingMarkers);
        if (existingMarkers && existingMarkers.length > 0) {
            setMarkers(existingMarkers);
        }
    }, [existingMarkers]);

    // const handleAddMarker = (marker: Marker, comment: string) => {
    //     const newMarker = { ...marker, comment };
    //     setMarkers([...markers, newMarker]);
    // };
    const handleAddMarker = (marker: Marker, comment: string) => {
        // const isMarkerExist = markers.some(
        //     (m) => m.top === marker.top && m.left === marker.left
        // );

        // if (!isMarkerExist) {
        const newMarker = { ...marker, comment };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        // } else {
        //     console.log("Marker already exists at this position.");
        // }
    };

    const handleSave = async () => {
        try {
            if (markers.length === 0) {
                return alert("Please add a new card before saving");
            }

            // const updatedCards = markers.map((mark: any) => ({
            //     top: mark.top,
            //     left: mark.left,
            //     comment: mark.comment,
            // }));

            const result = await addMarkers({
                variables: {
                    userId,
                    markers: markers,
                },
            });

            if (result) {
                refetch();
                console.log("Markers saved successfully!");
            }
        } catch (error) {
            console.error("Error saving marker:", error);
        }
    };

    console.log("markers", markers);

    return (
        <DefaultLayout>
            {loading ? (
                <Loader />
            ) : (
                <section className="h-full w-full">
                    <GetAll2dView
                        data={data?.getAll2DFiles}
                        allUsers={AllUsers}
                        uploadFile={uploadFile}
                        fileType={fileType || "view2d"}
                        title={"Your 2D Drawings"}
                        refetchUsers={refetch}
                        handleSave={handleSave}
                    />
                </section>
            )}

            {existingLoading ? (
                <p className="text-xl font-semibold">Loading....</p>
            ) : (
                <ImageMarker
                    src="/cover/banner-img.jpg"
                    markers={markers}
                    onAddMarker={(marker: Marker) => handleAddMarker(marker, "")} // Pass empty comment initially
                    markerComponent={(props) => (
                        <CustomMarker {...props} onAddComment={handleAddMarker} />
                    )}
                    extraClass="cursor-crosshair"
                />
            )}
        </DefaultLayout>
    );
};

export default Page;

const CustomMarker = ({
    onAddComment,
    top,
    left,
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputRef.current) {
            const marker = { top, left };
            onAddComment(marker, inputValue); // Pass the comment back to the Page component
            inputRef.current.blur();
        }
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
