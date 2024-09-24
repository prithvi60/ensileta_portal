"use client";

import React, { useEffect, useRef, useState } from "react";
import ClickOutside from "./ClickOutside";
import SidebarItem from "./SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useSession } from "next-auth/react";
import { GiCardDraw } from "react-icons/gi";
import { IoCallSharp, IoPeopleSharp } from "react-icons/io5";
import { GoOrganization } from "react-icons/go";
import { FaFileInvoice, FaQ } from "react-icons/fa6";
import { SiLibreofficedraw } from "react-icons/si";
import { MdAddIcCall } from "react-icons/md";
import { GET_USER } from "@/lib/Queries";
import { useQuery } from "@apollo/client";


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}


const menuGroups = [
  {
    name: "Ensileta Info",
    menuItems: [
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <SiLibreofficedraw className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your 2D drawings",
        route: "/portal/dashboard/view2d",
      },
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <GiCardDraw className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your 3D drawings",
        route: "/portal/dashboard/view3d",
      },
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <FaFileInvoice className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your BOQ",
        route: "/portal/dashboard/viewboq",

      },
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <IoPeopleSharp className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your Employee",
        route: "/portal/dashboard/accessControl",
      },
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <GoOrganization className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your Organisation",
        route: "/portal/dashboard/customerProfile",
      },
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <IoCallSharp className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Support",
        route: "/portal/dashboard/faq",
      },

    ],
  },
];

const SAMenuGroups = [
  {
    name: "Ensileta Info",
    menuItems: [
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <SiLibreofficedraw className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your 2D drawings",
        route: "/portal/dashboard/view2d",
      },
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <GiCardDraw className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your 3D drawings",
        route: "/portal/dashboard/view3d",
      },
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <FaFileInvoice className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your BOQ",
        route: "/portal/dashboard/viewboq",

      },
      {
        icon: (
          <div className="p-1 rounded-md bg-secondary">
            <GoOrganization className="text-4xl sm:text-5xl text-white" />
          </div>
        ),
        label: "Your Organisation",
        route: "/portal/dashboard/customerProfile",
      }
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  // const [menuData, setMenuData] = useState(menuGroups)
  const { data: session } = useSession()
  const { data, loading } = useQuery(GET_USER);

  const role = data?.user?.role
  const userName = session?.user?.name

  // if (role === "super admin") {
  //   (setMenuData(SAMenuGroups))
  // } else {
  //   (setMenuData(menuGroups))
  // }

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-[1001] flex h-screen w-72.5 flex-col overflow-y-hidden bg-primary duration-300 ease-linear lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <h2 className="text-2xl ml-5 capitalize font-semibold tracking-wider text-white ">{`Welcome ${userName}`}</h2>
          {/* <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              priority
            />
          </Link> */}

          {/* <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button> */}
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto scrollbar duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          {role === "super admin" ? (<nav className="px-4 py-4 lg:px-6">
            {SAMenuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 capitalize text-xl font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>) : (<nav className="px-4 py-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 capitalize text-xl font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>)}
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;