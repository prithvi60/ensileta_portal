
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "@/lib/Queries";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const { data: session } = useSession()
  const email = session?.user?.email
  const handleLogout = async () => {
    if (email) {
      await logoutMutation({
        variables: { email }
      });
      console.log("notify", email);
    }
    await signOut({ redirect: true, callbackUrl: "/api/auth/signin" });
    localStorage.removeItem("selectedMenu");
  }

  return (
    <>
      <button onClick={handleLogout} type="submit" className='ml-2 cursor-pointer px-5 py-2 shadow-md select-none bg-secondary text-white hover:bg-[#0E122B]'>Log Out</button>
    </>
  );
};

export default DropdownNotification;
