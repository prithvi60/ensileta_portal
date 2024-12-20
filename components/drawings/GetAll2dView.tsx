"use client";

import ModernCarousel from "./SwipeCarousal";
import ShuffleSortTable from "./Table";
import { GET_USER, TOGGLE_APPROVE_DRAWING } from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import React from "react";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import Loader2 from "../Loader2";
import DeleteModal from "../superAdminTable/Modal";

interface FileData {
  id: number;
  filename: string;
  fileUrl: string;
  version: number;
  createdAt: string;
  approve?: boolean;
}

interface User {
  id: string;
  role: string;
  email: string;
  username: string;
}

interface AllUsers {
  users: User[];
}

interface GetAll2DViewProps {
  data?: FileData[];
  uploadFile: any;
  title: string;
  allUsers: AllUsers;
  fileType: string;
  refetchUsers: () => void;
  lastItem: FileData | null;
  createMarkerGroup: (marker: any) => void;
  markerData: any;
  approveType: string;
}

export const GetAll2dView: React.FC<GetAll2DViewProps> = ({
  data = [],
  uploadFile,
  title,
  allUsers,
  fileType,
  refetchUsers,
  createMarkerGroup,
  lastItem,
  markerData,
  approveType,
}) => {
  const { data: RoleBased } = useQuery<{ user: User }>(GET_USER);
  const [isApproved, setIsApproved] = useState(lastItem?.approve || false);
  const [isApproving, setIsApproving] = useState(false);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toggleApproveDrawing] = useMutation(TOGGLE_APPROVE_DRAWING);

  useEffect(() => {
    if (allUsers?.users) {
      const admins = allUsers.users.filter((val) => val.role === "admin") || [];
      setFilteredData(admins);
    }
  }, [allUsers]);

  const userId = RoleBased?.user?.id;

  const handleSendEmail = async () => {
    try {
      setIsApproving(true);
      setIsOpen(false);
      toggleApproveDrawing({
        variables: { id: lastItem?.id, drawingType: approveType },
      });
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: `${RoleBased?.user?.email}`,
          recipientType: "client",
          subject1: `Client Version Approved by ${RoleBased?.user?.username}`,
          message1: `The newest version of the <strong>${fileType}</strong> drawing has been approved by 
          ${RoleBased?.user?.username} - < ${RoleBased?.user?.email}>, and we're excited to move forward!`,
        }),
      });

      if (!response.ok) {
        throw new Error("Error: please reload and try again");
      }

      const data = await response.json();
      if (data) {
        setIsApproved(true);
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
      setIsOpen(false);
    }
  };

  const renderAdminView = () => (
    <ShuffleSortTable
      uploadFile={uploadFile}
      data={filteredData}
      fileType={fileType}
      refetchUsers={refetchUsers}
    />
  );

  const renderUserView = () => (
    <>
      <ModernCarousel
        pdf={lastItem?.fileUrl || ""}
        version={data.length || 0}
        id={lastItem?.id || 1}
        createMarkerGroup={createMarkerGroup}
        userId={Number(userId) || 0}
        markerData={markerData}
        fileType={fileType}
      />
      <div className="w-full flex flex-col justify-between items-center text-justify">
        <button
          disabled={isApproved || isApproving || lastItem === null}
          type="submit"
          className="cursor-pointer w-full sm:w-1/2 p-3 2xl:p-4 shadow-md select-none bg-secondary text-white hover:bg-primary disabled:bg-opacity-70 disabled:cursor-not-allowed"
          onClick={() => setIsOpen(true)}
        >
          {isApproving ? <Loader2 /> : isApproved ? "Approved" : `Approve`}
        </button>
        <DeleteModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          confirmDeleteCard={handleSendEmail}
        />
        <div className="mt-8 flex gap-2">
          <span>
            <BiSolidMessageRoundedDots className="text-xl md:text-2xl text-secondary" />
          </span>
          <p className="text-sm md:text-base">
            Please review the drawings and click the &apos;Approve&apos; button
            to confirm if this version is acceptable. You can add comments in
            the &apos;Remarks&apos; section by viewing the drawing in fullscreen
            and annotating directly on the image.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-full w-full py-3 md:pb-6 md:px-10 space-y-5">
      <h2 className="text-2xl 2xl:text-3xl w-full text-center font-semibold caption-bottom tracking-wide">
        {title}
      </h2>
      {RoleBased?.user?.role === "super admin" ||
        RoleBased?.user?.role === "contact admin" ||
        RoleBased?.user?.role === "design admin" ||
        RoleBased?.user?.role === "project admin"
        ? renderAdminView()
        : renderUserView()}
    </div>
  );
};
