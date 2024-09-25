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

      }
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { data: session } = useSession()
  const { data, loading } = useQuery(GET_USER);

  const role = data?.user?.role
  const userName = session?.user?.name


  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-[1001] flex h-screen w-72.5 flex-col overflow-y-hidden bg-primary duration-300 ease-linear lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <h2 className="text-2xl ml-5 capitalize font-semibold tracking-wider text-white ">{`Hi, ${userName}`}</h2>
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