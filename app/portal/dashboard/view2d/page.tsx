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
import { FaCircleArrowUp } from "react-icons/fa6";
import { useSession } from "next-auth/react";
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
  const [markers, setMarkers] = useState<
    Array<Marker & { comment?: string; }>
  >([
    // Update from DB
        {
            "top": 45.12916772715704,
            "left": 51.92,
            "comment": "change colour",
        },
        {
            "top": 64.83901756172054,
            "left": 30.24,
            "comment": "remove this",
        }
  ]);

  // const handleAddMarker = (marker: Marker, comment: string) => {
  //     const newMarker = { ...marker, comment };
  //     setMarkers([...markers, newMarker]);
  // };
  const handleAddMarker = (marker: Marker, comment: string) => {
    // console.log("new",marker)
    // const latestcomment = comment === "" ? "nil" : comment;
    const newMarker = { ...marker, comment: comment};
    setMarkers((prevMarkers) => {
      const filteredMarkers = prevMarkers.filter(
        (m) => m.top !== newMarker.top
      );
      return [...filteredMarkers, newMarker];
    });
  };

  const handleSave = async () => {
    try {
      if (markers.length === 0) {
        return alert("Please add a new card before saving");
      }

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

//   console.log("markers", markers);

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

      <ImageMarker
        src="/cover/banner-img.jpg"
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
    </DefaultLayout>
  );
};

export default Page;

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
    const existingMarker = markers.find((marker: { top: Number; }) => marker.top === top);
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
      {
        isHovered
       ? (
          <div className="relative">
            <label className="mb-.5 block font-medium text-white">
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
              {storedValue.length === 0?
              <button
                className="absolute right-4 top-[42%] transform -translate-y-1/2 cursor-pointer "
                onClick={handleBtn} // Trigger handleKeyDown on click
                // disabled={storedValue.length > 0}
              >
                <FaCircleArrowUp size={24} className={"text-secondary"}  />
              </button>:null}
            </div>
          </div>
        ) : (
          <div className="absolute top-0 left-0 flex items-center">
            <GiVirtualMarker className="text-4xl sm:text-5xl text-white shadow-md" />
          </div>
        )
      }
    </div>
  );
};
