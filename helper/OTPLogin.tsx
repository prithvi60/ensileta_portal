"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { GENERATE_OTP } from "@/lib/Queries";
import { signIn } from "next-auth/react";

const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type EmailFields = z.infer<typeof emailSchema>;
type OtpFields = z.infer<typeof otpSchema>;

export const OTPLogin = () => {
    const [step, setStep] = useState<"email" | "otp">("email");
    const [generateOtp, { loading }] = useMutation(GENERATE_OTP);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit: handleEmailSubmit,
        formState: { errors },
        reset: resetEmailForm,
    } = useForm<EmailFields>({
        resolver: zodResolver(emailSchema),
    });

    const {
        register: registerOtp,
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors },
    } = useForm<OtpFields>({
        resolver: zodResolver(otpSchema),
    });

    const onEmailSubmit = async (data: EmailFields) => {
        try {
            setError("");
            setEmail(data.email);
            setStep("otp");
            resetEmailForm();
            const { data: result } = await generateOtp({
                variables: { email: data.email },
            });

            if (result.generateOtp.success) {
                resetEmailForm();
                toast.success("OTP sent to your email", {
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
            } else {
                throw new Error(result.generateOtp.message);
            }
        } catch (err: any) {
            setError(err.message || "Failed to send OTP");
            toast.error(err.message || "Failed to send OTP", {
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
        }
    };

    const onOtpSubmit = async (data: OtpFields) => {
        try {
            setError("");

            const result = await signIn("credentials", {
                email,
                credential: data.otp,
                method: "otp",
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

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
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid OTP");
            toast.error(err.message || "Invalid OTP", {
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
        }
    };

    return (
        <div className="px-4 md:px-6 space-y-7 relative">
            {step === "email" ? (
                <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-7">
                    <div className="mb-4 relative">
                        <label className="mb-2.5 block font-medium text-black">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
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

                    <button
                        // disabled={loading}
                        type="submit"
                        className={`w-full cursor-pointer rounded-md p-2 text-white transition bg-success font-semibold ${loading
                            ? "bg-opacity-40 cursor-not-allowed"
                            : "hover:bg-opacity-90"
                            }`}
                    >
                        {"Send OTP"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-7">
                    <div className="mb-4 relative">
                        <label
                            htmlFor="otp-code"
                            className="mb-2.5 block font-medium text-black"
                        >
                            Enter OTP
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="otp-code"
                                placeholder="Enter 6-digit OTP"
                                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                {...registerOtp("otp")}
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-2.5 text-center">
                            OTP sent to {email}
                        </p>
                        {otpErrors.otp && (
                            <div className="absolute -bottom-4 left-0 w-full text-xs md:text-sm text-red font-semibold text-center mt-1">
                                {otpErrors.otp.message}
                            </div>
                        )}
                    </div>

                    <div className="block">
                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full cursor-pointer rounded-md p-2 text-white transition bg-success font-semibold ${loading
                                ? "bg-opacity-40 cursor-not-allowed"
                                : "hover:bg-opacity-90"
                                }`}
                        >
                            {"Verify OTP"}
                        </button>
                    </div>
                </form>
            )}

            {error && (
                <div className="absolute -bottom-6 text-xs md:text-sm w-full left-1/2 -translate-x-1/2 text-red font-semibold text-center">
                    {error}
                </div>
            )}
        </div>
    );
};
