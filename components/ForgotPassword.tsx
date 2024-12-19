"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from "next/image";
import Loader2 from "./Loader2";

const schema = z.object({
    email: z.string().email("Invalid email address"),
});
type FormFields = z.infer<typeof schema>;

const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const onSubmit = async (data: FormFields) => {
        try {
            setIsSubmitting(true);
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }
            setIsSubmitted(true)
            toast.success("Password reset email sent!", {
                position: "top-right",
                duration: 3000,
                style: {
                    border: "1px solid #499d49",
                    padding: "16px",
                    color: "#499d49",
                },
            });
        } catch (error: any) {
            setIsSubmitted(false)
            toast.error(error.message || "An error occurred.", {
                position: "top-right",
                duration: 3000,
                style: {
                    border: "1px solid #EB1C23",
                    padding: "16px",
                    color: "#EB1C23",
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`rounded-md border-4 border-secondary w-full max-w-3xl mx-auto bg-white shadow-xl m-4 p-3 md:p-6 ${isSubmitted ? "max-w-lg" : "max-w-3xl"}`}>
            <div className="w-full justify-center flex mb-4">
                <div className="w-64 h-14 relative items-center flex justify-center">
                    <Image alt="logo" src={"/logo/newlogo.png"} fill />
                </div>
            </div>
            {isSubmitted ? (<div>
                <h2 className="text-xl mt-8 animate-pulse font-bold text-warning tracking-wider text-center">
                    The email has been sent successfully. Check your inbox now for the message!.
                </h2>
            </div>) : (<>
                <h2 className="text-2xl font-bold text-[#0E132A] text-center">
                    Forgot Password
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-6 px-6 sm:px-12.5"
                >
                    <div className="relative">
                        <label className="mb-2.5 block font-medium text-[#0E132A]">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="absolute -bottom-5 left-0 w-full text-xs md:text-sm text-warning font-semibold mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className={`w-full cursor-pointer p-4 text-white transition bg-secondary ${isSubmitting
                            ? "bg-opacity-40 cursor-not-allowed"
                            : "hover:bg-opacity-90"
                            }`}
                    >
                        {isSubmitting ? <Loader2 /> : "Send Reset Email"}
                    </button>
                </form>
            </>)}

        </div>
    )
}

export default ForgotPassword
