"use client";

import React, { useEffect, useMemo, useState } from "react";
import ClickOutside from "./ClickOutside";
import SidebarItem from "./SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useSession } from "next-auth/react";
import { GiCardDraw } from "react-icons/gi";
import { IoCallSharp, IoPeopleSharp } from "react-icons/io5";
import { GoOrganization } from "react-icons/go";
import { FaFileInvoice, FaQ } from "react-icons/fa6";
import { SiLibreofficedraw } from "react-icons/si";
import { GET_EMPLOYEE, GET_USERS } from "@/lib/Queries";
import { useQuery } from "@apollo/client";
import { FaFlipboard } from "react-icons/fa";
import { MdApproval } from "react-icons/md";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "");
  const [search, setSearch] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { data: session, status: sessionStatus } = useSession();
  // const { name } = useParams();
  const { data: employee, loading: employeeLoading } = useQuery(GET_EMPLOYEE);
  const { data: allUsers, loading: usersLoading } = useQuery(GET_USERS);

  const role = session?.user?.role;
  const userName = session?.user?.name;
  const employeeUserName = employee?.getEmployeeUser?.username;

  const admins = useMemo(() => {
    return allUsers?.users?.filter((val: any) => val.role === "admin") || [];
  }, [allUsers]);

  const admins2 = useMemo(() => {
    return (
      allUsers?.users?.filter((val: any) => val.username === userName) || []
    );
  }, [allUsers, userName]);

  const sortedCompanies = admins.sort((a: any, b: any) =>
    a?.company_name.localeCompare(b?.company_name, undefined, {
      sensitivity: "base",
    })
  );

  useEffect(() => {
    if (search.trim()) {
      const results = sortedCompanies.filter((val: any) =>
        val?.company_name?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData(sortedCompanies);
    }
  }, [search, sortedCompanies]);

  const menuGroups = [
    {
      name: "Ensileta Info",
      menuItems: [
        role !== "employee" && {
          icon: (
            <div className="p-1 rounded-md bg-secondary">
              <IoPeopleSharp className="text-3xl md:text-4xl 2xl:text-5xl text-white" />
            </div>
          ),
          label: "Add Team",
          route: "/portal/dashboard/accessControl",
        },
        {
          icon: (
            <div className="p-1 rounded-md bg-secondary">
              <SiLibreofficedraw className="text-3xl md:text-4xl 2xl:text-5xl text-white" />
            </div>
          ),
          label: "2D drawings",
          route: "/portal/dashboard/view2d",
        },
        {
          icon: (
            <div className="p-1 rounded-md bg-secondary">
              <GiCardDraw className="text-3xl md:text-4xl 2xl:text-5xl text-white" />
            </div>
          ),
          label: "3D drawings",
          route: "/portal/dashboard/view3d",
        },
        {
          icon: (
            <div className="p-1 rounded-md bg-secondary">
              <FaFlipboard className="text-3xl md:text-4xl 2xl:text-5xl text-white" />
            </div>
          ),
          label: "Mood Board",
          route: "/portal/dashboard/moodBoard",
        },
        {
          icon: (
            <div className="p-1 rounded-md bg-secondary">
              <MdApproval className="text-3xl md:text-4xl 2xl:text-5xl text-white" />
            </div>
          ),
          label: "Approval Board",
          route: "/portal/dashboard/approvalBoard",
        },
        {
          icon: (
            <div className="p-1 rounded-md bg-secondary">
              <FaFileInvoice className="text-3xl md:text-4xl 2xl:text-5xl text-white" />
            </div>
          ),
          label: "BOQ",
          route: "/portal/dashboard/viewboq",
        },
        // {
        //   icon: (
        //     <div className="p-1 rounded-md bg-secondary">
        //       <GoOrganization className="text-4xl sm:text-5xl text-white" />
        //     </div>
        //   ),
        //   label: "Organisation",
        //   route: "/portal/dashboard/customerProfile",
        // },
        {
          icon: (
            <div className="p-1 rounded-md bg-secondary">
              <IoCallSharp className="text-4xl sm:text-5xl text-white" />
            </div>
          ),
          label: "Support",
          route: "/portal/dashboard/faq",
        },
      ].filter(Boolean),
    },
  ];

  // Display loading if session or user data is not ready
  // if (sessionStatus === "loading" || usersLoading || employeeLoading) {
  //   return (
  //     <aside className="flex justify-center items-center h-full w-full">
  //       <Loader />
  //     </aside>
  //   );
  // }

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-[1001] flex h-screen w-72.5 flex-col overflow-y-hidden bg-primary duration-300 ease-linear lg:translate-x-0 gap-4 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* {sessionStatus === null || usersLoading || employeeLoading ? (
          <div className="flex justify-center items-center gap-2.5 h-full w-full px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out text-xl capitalize line-clamp-2">
            Loading...
          </div>
        ) : (
          <> */}
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex flex-col gap-8 px-6 pt-5.5 pb-3.5 lg:pb-4.5 lg:pt-6.5">
          <>
            {role === "employee" ? (
              <div className="space-y-1 text-white relative">
                <h2 className="text-2xl ml-5 capitalize font-semibold tracking-wider">{`Hi, ${employeeUserName}`}</h2>
                <p className="absolute -bottom-7 left-0  text-sm md:text-base tracking-wide capitalize font-medium transition-all duration-700 ease-in">
                  {admins2[0]?.company_name}
                </p>
              </div>
            ) : (
              <div className="space-y-1 text-white relative">
                <h2 className="text-2xl capitalize font-semibold tracking-wider">{`Hi, ${userName}`}</h2>
                <p className="absolute -bottom-7 left-0 text-sm md:text-base tracking-wide capitalize font-medium transition-all duration-700 ease-in">
                  {admins2[0]?.company_name}
                </p>
              </div>
            )}
            {role === "super admin" ||
              role === "contact admin" ||
              role === "design admin" ||
              (role !== "project admin" && (
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Search customer"
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full border border-stroke bg-white rounded-lg py-2 pl-3 pr-7 text-[#0E132A] text-sm outline-none focus:border-primary focus-visible:shadow-none placeholder:text-sm"
                    />

                    <span className="absolute right-2 top-2">
                      <svg
                        // className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                            stroke="#394b7a"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
          </>
          {/* )} */}
        </div>
        {/* <!-- SIDEBAR HEADER --> */}
        {/* {sessionStatus === null || usersLoading || employeeLoading ? (
          <div className="flex justify-center items-center gap-2.5 h-full w-full px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out text-xl capitalize line-clamp-2">
            Loading...
          </div>
        ) : ( */}
        <div className="no-scrollbar flex flex-col overflow-y-auto sidebar_scroll duration-300 ease-linear h-full max-h-[75vh]">
          {sessionStatus === "loading" ? (
            <div className="flex justify-center items-center gap-2.5 h-full w-full px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out text-xl capitalize line-clamp-2">
              Loading...
            </div>
          ) : (
            <>
              {role === "super admin" ||
                role === "contact admin" ||
                role === "design admin" ||
                role !== "project admin" ? (
                <nav className="px-4 py-4 lg:px-6">
                  {filteredData?.map((group: any, groupIndex: number) => (
                    <div key={groupIndex}>
                      <ul className="mb-6 flex flex-col gap-1.5">
                        <SidebarItem
                          key={groupIndex}
                          item={""}
                          pageName={pageName}
                          setPageName={setPageName}
                          companyName={group?.company_name}
                        />
                      </ul>
                    </div>
                  ))}
                </nav>
              ) : (
                <nav className="px-4 py-4 lg:px-6">
                  {menuGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      <ul className="mb-6 flex flex-col gap-1.5">
                        {group.menuItems.map((menuItem, menuIndex) => (
                          <SidebarItem
                            key={menuIndex}
                            item={menuItem}
                            pageName={pageName}
                            setPageName={setPageName}
                            companyName={""}
                          />
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              )}
            </>
          )}
          {/* <!-- Sidebar Menu --> */}

          {/* <!-- Sidebar Menu --> */}
        </div>
        {/* )} */}
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
