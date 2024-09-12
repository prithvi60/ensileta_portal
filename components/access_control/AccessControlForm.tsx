"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import toast from 'react-hot-toast';

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6),
});

type FormFields = z.infer<typeof schema>;

const AccessControlForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        console.log(data);

        // try {
        //     const result = await signIn("credentials", {
        //         redirect: false,
        //         ...data
        //     });

        //     if (result?.error) {
        //         setError("root", { message: result.error });
        //         toast.error(result.error, {
        //             position: "top-right",
        //             duration: 3000,
        //             style: {
        //                 border: '1px solid #C72422',
        //                 padding: '16px',
        //                 color: '#C72422',
        //             },
        //             iconTheme: {
        //                 primary: '#C72422',
        //                 secondary: '#FFFAEE',
        //             },
        //         });
        //     } else {
        //         router.push("/portal/dashboard/customerProfile")
        //         toast.success('Logged in successfully', {
        //             position: "top-right",
        //             duration: 3000,
        //             style: {
        //                 border: '1px solid #139F9B',
        //                 padding: '16px',
        //                 color: '#139F9B',
        //             },
        //             iconTheme: {
        //                 primary: '#139F9B',
        //                 secondary: '#FFFAEE',
        //             },
        //         });
        //     }

        // } catch (error) {
        //     console.error("An unexpected error occurred:", error);
        //     setError("root", { message: "An unexpected error occurred" });
        //     toast.error("An unexpected error occurred");
        // }
    };

    return (

        <div className="bg-white shadow-xl m-4">
            <div className="flex justify-center flex-wrap items-center">
                <div className="w-full p-4 sm:px-16 sm:py-0 xl:w-3/4">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5 text-[#0E132A]">
                        <h2 className="mb-9 text-2xl font-bold text-[#0E132A] sm:text-title-xl2">
                            Add Employees to Ensileta Portal
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-[#0E132A]">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                                        {...register("email")} />

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
                                    <div className="text-[#C72422] font-semibold text-center mt-1">{errors.email.message}</div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="mb-2.5 block font-medium text-[#0E132A]">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="6+ Characters, 1 Capital letter"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                                        {...register("password")} />

                                    <span className="absolute right-4 top-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (<svg
                                            width="22"
                                            height="22"
                                            viewBox="0 0 22 22"
                                            fill="none"
                                            stroke='#878995' strokeOpacity={"0.4"} xmlns="http://www.w3.org/2000/svg"><g stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m1 12s4-8 11-8 11 8 11 8" /><path d="m1 12s4 8 11 8 11-8 11-8" /><circle cx="12" cy="12" r="3" /></g>
                                        </svg>) : (<svg width="22"
                                            height="22"
                                            viewBox="0 0 22 22"
                                            fill="none"
                                            stroke='#878995' strokeOpacity={"0.4"} xmlns="http://www.w3.org/2000/svg"><g stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m2 2 20 20" /><path d="m6.71277 6.7226c-3.04798 2.07267-4.71277 5.2774-4.71277 5.2774s3.63636 7 10 7c2.0503 0 3.8174-.7266 5.2711-1.7116m-6.2711-12.23018c.3254-.03809.6588-.05822 1-.05822 6.3636 0 10 7 10 7s-.6918 1.3317-2 2.8335" /><path d="m14 14.2362c-.5308.475-1.2316.7639-2 .7639-1.6569 0-3-1.3431-3-3 0-.8237.33193-1.5698.86932-2.11192" /></g></svg>)}
                                    </span>
                                </div>
                                {errors.password && (
                                    <div className="text-[#C72422] font-semibold text-center mt-1">{errors.password.message}</div>
                                )}
                            </div>

                            {/* <div className=""> */}
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full cursor-pointer rounded-lg p-4 text-white transition hover:bg-opacity-90 bg-[#139F9B] mb-5"
                            >{isSubmitting ? "Submitting..." : "Submit"}</button>
                            {/* </div> */}


                            {errors.root && <div className="text-[#C72422] font-semibold text-center mt-5">{errors.root.message}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AccessControlForm