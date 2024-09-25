"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from 'react-hot-toast';
import { GET_USERS, SIGN_UP } from '@/lib/Queries';
import Link from 'next/link';
import Image from 'next/image';

// Define the validation schema using Zod
const schema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(30, { message: "Username must be less than 30 characters" }),
    email: z.string()
        .email({ message: "Invalid email address" }),
    company_name: z.string()
        .min(3, { message: "Company name must be at least 3 characters long" })
        .max(30, { message: "Company name must be less than 30 characters" }),
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
    // const { data: AllUsers } = useQuery(GET_USERS);
    // const SAfilteredData = AllUsers.users.filter((val: any) => val.role === "super admin")
    // console.log(SAfilteredData);


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
        // console.log("submitted", data);

        try {
            const { data: result } = await signUp({ variables: { ...data } });

            const response = await fetch('/api/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Session info not changing based after update
                body: JSON.stringify({
                    recipientEmail: `prithvi@webibee.com`,
                    subject: 'New Account Created',
                    message: `Successfully created an new account for ${data.company_name} Company`,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const allData = await response.json();

            if (result && allData) {
                router.push("/api/auth/signin");
                toast.success('Signed up successfully', {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: '1px solid #65a34e',
                        padding: '16px',
                        color: '#65a34e',
                    },
                    iconTheme: {
                        primary: '#65a34e',
                        secondary: '#FFFAEE',
                    },
                });
            } else {
                setError("root", { message: "Invalid Sign Up" });
                toast.error("Invalid Sign Up", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: '1px solid #EB1C23',
                        padding: '16px',
                        color: '#EB1C23',
                    },
                    iconTheme: {
                        primary: '#EB1C23',
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
                    border: '1px solid #EB1C23',
                    padding: '16px',
                    color: '#EB1C23',
                },
                iconTheme: {
                    primary: '#EB1C23',
                    secondary: '#FFFAEE',
                },
            });
        }
    };

    return (
        <div className="rounded-md border-4 border-secondary bg-white shadow-xl m-4" >
            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="p-4 sm:px-16 sm:py-0 space-y-5 text-center flex justify-center flex-col">
                        <div className="w-64 h-14 relative items-center flex justify-center">
                            <Image alt="logo" src={"/logo/newlogo.png"} fill />
                        </div>
                        <span className="mt-15 inline-block">
                            <Image
                                src="/cover/ensiletaclients.png"
                                alt="clients"
                                width={450}
                                height={250}
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
                                        Company
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter your Company Name"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register('company_name')}
                                        />

                                        <span className="absolute right-4 top-2">
                                            <svg
                                                className="fill-current"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 50 50"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.5">
                                                    <path d="M8 2L8 6L4 6L4 48L46 48L46 14L30 14L30 6L26 6L26 2 Z M 10 4L24 4L24 8L28 8L28 46L19 46L19 39L15 39L15 46L6 46L6 8L10 8 Z M 10 10L10 12L12 12L12 10 Z M 14 10L14 12L16 12L16 10 Z M 18 10L18 12L20 12L20 10 Z M 22 10L22 12L24 12L24 10 Z M 10 15L10 19L12 19L12 15 Z M 14 15L14 19L16 19L16 15 Z M 18 15L18 19L20 19L20 15 Z M 22 15L22 19L24 19L24 15 Z M 30 16L44 16L44 46L30 46 Z M 32 18L32 20L34 20L34 18 Z M 36 18L36 20L38 20L38 18 Z M 40 18L40 20L42 20L42 18 Z M 10 21L10 25L12 25L12 21 Z M 14 21L14 25L16 25L16 21 Z M 18 21L18 25L20 25L20 21 Z M 22 21L22 25L24 25L24 21 Z M 32 22L32 24L34 24L34 22 Z M 36 22L36 24L38 24L38 22 Z M 40 22L40 24L42 24L42 22 Z M 32 26L32 28L34 28L34 26 Z M 36 26L36 28L38 28L38 26 Z M 40 26L40 28L42 28L42 26 Z M 10 27L10 31L12 31L12 27 Z M 14 27L14 31L16 31L16 27 Z M 18 27L18 31L20 31L20 27 Z M 22 27L22 31L24 31L24 27 Z M 32 30L32 32L34 32L34 30 Z M 36 30L36 32L38 32L38 30 Z M 40 30L40 32L42 32L42 30 Z M 10 33L10 37L12 37L12 33 Z M 14 33L14 37L16 37L16 33 Z M 18 33L18 37L20 37L20 33 Z M 22 33L22 37L24 37L24 33 Z M 32 34L32 36L34 36L34 34 Z M 36 34L36 36L38 36L38 34 Z M 40 34L40 36L42 36L42 34 Z M 32 38L32 40L34 40L34 38 Z M 36 38L36 40L38 40L38 38 Z M 40 38L40 40L42 40L42 38 Z M 10 39L10 44L12 44L12 39 Z M 22 39L22 44L24 44L24 39 Z M 32 42L32 44L34 44L34 42 Z M 36 42L36 44L38 44L38 42 Z M 40 42L40 44L42 44L42 42Z" />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                {errors.company_name && (
                                    <div className="text-warning font-semibold text-center text-sm mt-1">{errors.company_name.message}</div>
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
