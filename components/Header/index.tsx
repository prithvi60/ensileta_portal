import DropdownNotification from "./DropdownNotification";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { MarqueeSb } from "./MarqueeUpdated";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  // const [signUp, { data, loading, error }] = useMutation(SIGN_UP);
  // console.log(data);
  const { data: session, status: sessionStatus } = useSession();
  // const { name } = useParams();

  const role = session?.user?.role;
  return (
    <header className="sticky top-0 z-[1000] flex w-full bg-white drop-shadow-1">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center w-max xl:w-[85%] overflow-hidden gap-3 md:gap-5 ">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-9999 block rounded-sm border border-stroke p-1.5 shadow-sm bg-primary lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-300"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "delay-400 !w-full"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-500"
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-[0]"
                    }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-200"
                    }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}
          {/* </div> */}
          {/* <div > */}
          <div className="w-64 h-10 relative hidden sm:block">
            <Image alt="logo" src={"/logo/newlogo.png"} fill priority sizes="(min-width: 1380px) 256px, (min-width: 1280px) calc(63.75vw - 611px), 242px" />
          </div>
          {/* <div className=""> */}
          {sessionStatus === "loading" ? (<div></div>) : (<>
            {role !== "super admin" && role !== "contact admin" &&
              role !== "design admin" && role !== "project admin" && (
                <div className="hidden sm:block sm:max-w-48 md:max-w-72 xl:max-w-xl w-full">
                  <MarqueeSb />
                </div>
              )}
          </>)}

          {/* </div> */}
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* <!-- Notification Menu Area --> */}
          <DropdownNotification />
          {/* <!-- Notification Menu Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
