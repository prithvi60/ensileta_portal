"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from 'react-hot-toast';
import { SIGN_UP } from '@/lib/Queries';
import Link from 'next/link';
import Image from 'next/image';

// Define the validation schema using Zod
const schema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(30, { message: "Username must be less than 30 characters" }),
    email: z.string()
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[\W_]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string()
        .min(6, { message: "Confirm Password must be at least 6 characters long" })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type FormFields = z.infer<typeof schema>;

export const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [signUp] = useMutation(SIGN_UP);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting, isValid },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { data: result } = await signUp({ variables: { ...data } });

            if (result) {
                router.push("/api/auth/signin");
                toast.success('Signed up successfully', {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: '1px solid #63b6b3',
                        padding: '16px',
                        color: '#63b6b3',
                    },
                    iconTheme: {
                        primary: '#63b6b3',
                        secondary: '#FFFAEE',
                    },
                });
            } else {
                setError("root", { message: "Invalid Sign Up" });
                toast.error("Invalid Sign Up", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: '1px solid #9d4949',
                        padding: '16px',
                        color: '#9d4949',
                    },
                    iconTheme: {
                        primary: '#9d4949',
                        secondary: '#FFFAEE',
                    },
                });
            }
        } catch (error: any) {
            console.error("An unexpected error occurred:", error);
            setError("root", { message: error.message });
            toast.error(error.message, {
                position: "top-right",
                duration: 3000,
                style: {
                    border: '1px solid #9d4949',
                    padding: '16px',
                    color: '#9d4949',
                },
                iconTheme: {
                    primary: '#9d4949',
                    secondary: '#FFFAEE',
                },
            });
        }
    };

    return (
        <div className="rounded-md border-4 border-secondary bg-white shadow-xl m-4" >
            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="p-4 sm:px-12 sm:py-0 space-y-5 text-center">
                        <div className='mb-10'>
                            {/* <h3 className="mb-5.5 inline-block tracking-wider font-sans font-bold text-secondary text-lg md:text-2xl">
                                Welcome To Ensileta Portal
                            </h3> */}

                            {/* <p className="2xl:px-20 text-[#0E132A]">
                                The home should be the treasure chest of living
                            </p> */}
                        </div>
                        <span className="mt-15 inline-block">
                        <Image
                src="/cover/ensiletaclients.png"
                alt="clients"
                width={450} 
                height={250}
                // layout="responsive" 
            />
                        </span>
                    </div>
                </div>

                <div className="w-full p-4 sm:px-6 sm:py-0 xl:w-1/2 xl:border-l-2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5 text-[#0E132A]">
                        {/* <span className="mb-1.5 block font-medium text-sm md:text-base">Start for free</span> */}
                        <h2 className="mb-6 text-lg font-bold text-[#0E132A] md:text-2xl">
                           Create a New Account
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' >
                            <div className=''>
                                <div className='flex gap-3 items-center'>
                                    <label className=" block font-medium text-[#0E132A] text-sm md:text-base">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register('username')} />

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
                                                        d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                                                        fill=""
                                                    />
                                                </g>
                                            </svg>
                                        </span>

                                    </div>
                                </div>
                                {errors.username && (
                                    <div className="text-warning font-semibold text-center text-sm mt-1">{errors.username.message}</div>
                                )}
                            </div>
                            <div>
                                <div className='flex gap-3 items-center'>
                                    <label className=" block font-medium text-[#0E132A] text-sm md:text-base">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register('email')}
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
                                </div>
                                {errors.email && (
                                    <div className="text-warning font-semibold text-center text-sm mt-1">{errors.email.message}</div>
                                )}
                            </div>

                            <div>
                                <div className='flex gap-3 items-center'>
                                    <label className=" block font-medium text-[#0E132A] text-sm md:text-base">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="6+ Characters, 1 Capital letter"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register('password')} />

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
                                </div>
                                {errors.password && (
                                    <div className="text-warning font-semibold text-center text-sm mt-1">{errors.password.message}</div>
                                )}
                            </div>

                            <div>
                                <div className='flex gap-3 items-center'>
                                    <label className="block font-medium text-[#0E132A] text-sm md:text-base">
                                        Re-type Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register('confirmPassword')} />

                                        <span className="absolute right-4 top-2 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? (<svg
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
                                </div>
                                {errors.confirmPassword && (
                                    <div className="text-warning font-semibold text-center text-sm mt-1">{errors.confirmPassword.message}</div>
                                )}
                            </div>

                            <div>
                                <button
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                    className={`w-full cursor-pointer  p-4 text-white transition  bg-secondary mb-5 ${!isValid || isSubmitting ? "bg-opacity-40 cursor-not-allowed" : "hover:bg-opacity-90"}`}
                                >{isSubmitting ? "Submitting..." : "Sign up"}
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <p>
                                    Already have an account?{" "}
                                    <Link href="/api/auth/signin" className="text-secondary">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
