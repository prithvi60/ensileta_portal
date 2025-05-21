"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";

const schema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });
type FormFields = z.infer<typeof schema>;

const ResetPasswordPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });
    const searchParams = useSearchParams();
    const router = useRouter();

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    const onSubmit = async (data: FormFields) => {
        const token = searchParams.get("token");
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ ...data, token }),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                toast.success("Password reset successfully");
                router.push("/api/auth/signin");
            } else {
                const error = await res.json();
                toast.error(error.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="rounded-md border-4 border-secondary w-full max-w-lg mx-auto bg-white shadow-xl m-4 p-3 md:p-6">
            <div className="w-full justify-center flex mb-4">
                <div className="w-64 h-14 relative items-center flex justify-center">
                    <Image alt="logo" src={"/logo/newlogo.png"} fill priority sizes="(min-width: 1380px) 256px, (min-width: 1280px) calc(63.75vw - 611px), 242px" />
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-7">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Reset Password
                </h2>
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter new password"
                            className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            {...register("password")}
                        />
                        <span
                            className="block absolute right-4 top-2 cursor-pointer"
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
                        <p className="text-sm text-warning">{errors.password.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium"
                    >
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            {...register("confirmPassword")}
                        />
                        <span
                            className="block absolute right-4 top-2 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
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
                    {errors.confirmPassword && (
                        <p className="text-sm text-warning">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 bg-secondary text-white rounded ${password !== confirmPassword || !password ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={password !== confirmPassword || !password}
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
