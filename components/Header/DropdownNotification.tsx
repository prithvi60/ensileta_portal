
import React, { useState } from "react";
import { signOut } from "next-auth/react";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/api/auth/signin" });
    localStorage.removeItem("selectedMenu");
  }

  return (
    <>
      <button onClick={handleLogout} type="submit" className='ml-2 cursor-pointer px-5 py-2 shadow-md select-none bg-secondary text-white hover:bg-[#0E122B]'>Log Out</button>
    </>
  );
};

export default DropdownNotification;
