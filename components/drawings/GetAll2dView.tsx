"use client";

import ModernCarousel from "./SwipeCarousal";
import ShuffleSortTable from "./Table";
import { GET_USER } from "@/lib/Queries";
import { useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Marquee } from "../Header/Marquee";
import Image from "next/image";
import React from "react"
import RemarkModal from "./RemarkModal";

interface FileData {
  id: number;
  filename: string;
  fileUrl: string;
  version: number;
  createdAt: string;
}

interface GetAll2DViewProps {
  data?: Array<FileData>;
  // loading: boolean
  // error?: Error;
  uploadFile: any;
  title: string;
  allUsers: any;
  fileType: string;
  refetchUsers: any;
  handleSave: any
}

export const GetAll2dView: React.FC<GetAll2DViewProps> = ({
  data,
  uploadFile,
  title,
  allUsers,
  fileType,
  refetchUsers,
  handleSave
}) => {
  const { data: RoleBased } = useQuery(GET_USER);
  // const { data: session } = useSession()
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [filteredData, setFilteredData] = useState<Array<any>>([]);

  useEffect(() => {
    // Update filteredData whenever allUsers changes
    const admins = allUsers.users.filter((val: any) => val.role === "admin");

    // console.log("refetched",admins)

    setFilteredData(admins);
  }, [allUsers]);

  const SAfilteredData = allUsers.users.filter(
    (val: any) => val.role === "super admin"
  );

  const userId = RoleBased?.user?.id;
  const lastItem = data?.[data?.length - 1] || null;

  // Unique localStorage key for each user and file type
  const localStorageKey = `isApproved_${userId}_${fileType}`;

  // Check localStorage to see if the button has been approved before
  useEffect(() => {
    const approved = localStorage.getItem(localStorageKey);
    if (approved === "true") {
      setIsApproved(true);
    }
  }, [localStorageKey]);

  useEffect(() => {
    if (lastItem?.id) {
      const currentApprovalStatus = localStorage.getItem(localStorageKey);
      if (currentApprovalStatus === "true") {
        const currentVersion = lastItem?.version;
        const previouslyApprovedVersion = localStorage.getItem(
          `${localStorageKey}_version`
        );

        if (previouslyApprovedVersion !== currentVersion.toString()) {
          setIsApproved(false);
          localStorage.removeItem(localStorageKey);
          localStorage.setItem(
            `${localStorageKey}_version`,
            currentVersion.toString()
          );
        }
      }
    }
  }, [lastItem?.id, lastItem?.version, localStorageKey]);

  const handleSendEmail = async () => {
    try {
      setIsApproving(true);
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Session info not changing based after update
        body: JSON.stringify({
          recipientEmail: `${SAfilteredData[0]?.email}`,
          subject: "Version Changed",
          message: "New Change",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data) {
        setIsApproved(true);
        localStorage.setItem(localStorageKey, "true");
        toast.success("Version Updated successfully", {
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
    } finally {
      setIsApproving(false);
    }
  };


  return (
    <div className="h-full w-full pt-6 md:p-10 space-y-5">
      <h2 className="text-3xl w-full text-center font-semibold caption-bottom tracking-wide mb-10">
        {title}
      </h2>
      {RoleBased?.user?.role === "super admin" ? (
        // Table format User Details for super admin
        <ShuffleSortTable
          uploadFile={uploadFile}
          data={filteredData}
          fileType={fileType}
          refetchUsers={refetchUsers}
        />
      ) : (
        <>
          {/* dynamically send pdf links */}
          <ModernCarousel
            pdf={lastItem?.fileUrl || ""}
            version={data?.length || 0}
            id={lastItem?.id || 1}

          />
          {/* <div className="w-full flex justify-between items-center">
            <button
              disabled={isApproved || isApproving}
              type="submit"
              className="cursor-pointer w-full sm:w-1/2 p-4 shadow-md select-none bg-secondary text-white hover:bg-primary disabled:bg-opacity-70 disabled:cursor-not-allowed"
              onClick={handleSendEmail}
            >
              {isApproving
                ? "Approving..."
                : isApproved
                  ? "Approved"
                  : `Approve`}
            </button> */}
            {/* <button
              type="button"
              className="cursor-pointer w-max p-4 shadow-md select-none bg-secondary text-white hover:bg-primary"
            // onClick={handleSendEmail}
            >
              Remarks
            </button> */}
            <RemarkModal handleSave={handleSave} pdf={lastItem?.fileUrl || ""} handleSendEmail={handleSendEmail} isApproved={isApproved} isApproving={isApproving}/>
          {/* </div> */}
        </>
      )}
      <div className="fixed bottom-0 z-[1000] flex flex-col justify-center  w-full bg-white drop-shadow-1 sm:hidden px-4 py-4 items-center shadow-2 md:px-6 2xl:px-11">
        <div className="w-64 h-8 relative">
          <Image alt="logo" src={"/logo/newlogo.png"} fill />
        </div>
        <Marquee />
      </div>
    </div>
  );
};
