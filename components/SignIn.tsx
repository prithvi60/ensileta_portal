"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import Image from "next/image";
import Loader2 from "./Loader2";
import Link from "next/link";
import { OTPLogin } from "@/helper/OTPLogin";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormFields = z.infer<typeof schema>;

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordLogin, setIsPasswordLogin] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        credential: data.password,
        method: "password",
        redirect: false,
      });

      if (result?.error) {
        setError("root", { message: result.error });
        toast.error(result.error, {
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
      } else {
        toast.success("Logged in successfully", {
          position: "top-right",
          duration: 3000,
          style: {
            border: "1px solid #499d49",
            padding: "16px",
            color: "#499d49",
          },
          iconTheme: {
            primary: "#499d49",
            secondary: "#FFFAEE",
          },
        });
      }
    } catch (error: any) {
      console.error("An unexpected error occurred:", error);
      setError("root", { message: error.message });
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (session?.user) {
      if (session?.user?.role === "admin") {
        router.push("/portal/dashboard/view2d");
      } else {
        router.push("/portal/dashboard");
      }
    }
  }, [session, router]);

  return (
    <div className="rounded-md border-4 border-secondary bg-white shadow-xl m-4">
      <div className="flex flex-wrap items-center p-4 md:p-7 xl:divide-x-2 divide-secondary">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="p-4 sm:px-16 sm:py-0 space-y-1 text-center flex justify-center flex-col">
            <h2 className="text-2xl font-bold text-secondary sm:text-2xl w-full text-center">
              Our Prestigious Clients
            </h2>
            <span className="mt-15 inline-block">
              <Image
                src="/cover/ensiletaclients.png"
                alt="clients"
                width={450}
                height={250}
                priority
              />
            </span>
          </div>
        </div>

        <div className="w-full p-4 sm:px-16 sm:py-0 xl:w-1/2">
          <div className="w-full justify-center flex mb-4">
            <div className="w-64 h-14 relative items-center flex justify-center ">
              <Image sizes="256px" alt="logo" src={"/logo/newlogo.png"} priority fill />
            </div>
          </div>
          <div className="w-full  text-[#0E132A] space-y-6">
            {/* <span className="mb-1.5 block font-medium ">Start for free</span> */}

            <h2 className="text-2xl font-bold text-[#0E132A] sm:text-2xl w-full text-center">
              Welcome to Ensileta Interiors
            </h2>
            {/* <h4 className='mb-7 text-xl font-semibold'>Sign in</h4> */}
            {/* Form with validation */}
            {!isPasswordLogin ? (
              <div className="px-4 md:px-6 space-y-7">
                <OTPLogin />
                <div className="text-center">
                  <button
                    onClick={() => setIsPasswordLogin(true)}
                    className="text-success font-semibold hover:underline cursor-pointer text-sm md:text-base"
                  >
                    Log in with the password instead
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="px-4 sm:px-12.5 xl:px-17.5 space-y-7 relative"
                >
                  <div className="mb-4 relative">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                        {...register("email")}
                      />

                      <span className="absolute right-4 top-2">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                    {errors.email && (
                      <div className="absolute -bottom-5 left-0 w-full text-xs md:text-sm text-warning font-semibold text-center mt-1">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-6 relative">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="6+ Characters, 1 Capital letter"
                        className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                        {...register("password")}
                      />

                      <span
                        className="absolute right-4 top-2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            stroke="#878995"
                            strokeOpacity={"0.4"}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g
                              stroke="#000"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            >
                              <path d="m1 12s4-8 11-8 11 8 11 8" />
                              <path d="m1 12s4 8 11 8 11-8 11-8" />
                              <circle cx="12" cy="12" r="3" />
                            </g>
                          </svg>
                        ) : (
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            stroke="#878995"
                            strokeOpacity={"0.4"}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g
                              stroke="#000"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            >
                              <path d="m2 2 20 20" />
                              <path d="m6.71277 6.7226c-3.04798 2.07267-4.71277 5.2774-4.71277 5.2774s3.63636 7 10 7c2.0503 0 3.8174-.7266 5.2711-1.7116m-6.2711-12.23018c.3254-.03809.6588-.05822 1-.05822 6.3636 0 10 7 10 7s-.6918 1.3317-2 2.8335" />
                              <path d="m14 14.2362c-.5308.475-1.2316.7639-2 .7639-1.6569 0-3-1.3431-3-3 0-.8237.33193-1.5698.86932-2.11192" />
                            </g>
                          </svg>
                        )}
                      </span>
                    </div>
                    {errors.password && (
                      <div className="absolute -bottom-5 left-0 w-full text-xs md:text-sm text-warning font-semibold text-center mt-1">
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className={`w-full cursor-pointer p-4 text-white transition  bg-secondary ${isSubmitting
                      ? "bg-opacity-40 cursor-not-allowed"
                      : "hover:bg-opacity-90"
                      }`}
                  >
                    {isSubmitting ? <Loader2 /> : "Log In"}
                  </button>

                  {errors.root && (
                    <div className="absolute -bottom-6 text-sm md:text-base w-full left-1/2 -translate-x-1/2 text-warning font-semibold text-center mt-5">
                      {errors.root.message}
                    </div>
                  )}
                </form>
                <div className="text-end">
                  <p>
                    <Link
                      href="/forgot-password"
                      className="text-primary text-sm md:text-base hover:text-primary/70"
                    >
                      Forgot Password ?
                    </Link>
                  </p>
                </div>
                <div className="text-center">
                  <button
                    role="button"
                    onClick={() => setIsPasswordLogin(false)}
                    className="text-success font-semibold hover:underline cursor-pointer text-sm md:text-base"
                  >
                    Log in with the OTP instead
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
