"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { GET_USERS, SIGN_UP } from "@/lib/Queries";
import Link from "next/link";
import Image from "next/image";
import { FaPhoneVolume, FaRegAddressBook } from "react-icons/fa6";
import Loader2 from "./Loader2";

// Define the validation schema using Zod
const schema = z
    .object({
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters" })
            .max(70, { message: "Username must be less than 30 characters" }),
        email: z.string().email({ message: "Invalid email address" }),
        company_name: z
            .string()
            .min(3, { message: "Company name must be at least 3 characters" })
            .max(50, { message: "Company name must be less than 30 characters" }),
        department: z
            .string()
            .min(2, { message: "Department name must be at least 2 characters" })
            .max(50, { message: "Department name must be less than 30 characters" }),
        phone_number: z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .max(10, "Phone number must not exceed 10 digits"),
        address: z.string().min(10, "Address is required"),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter",
            })
            .regex(/[a-z]/, {
                message: "Password must contain at least one lowercase letter",
            })
            .regex(/\d/, { message: "Password must contain at least one number" })
            .regex(/[\W_]/, {
                message: "Password must contain at least one special character",
            }),
        confirmPassword: z.string().min(6, {
            message: "Confirm Password must be at least 6 characters",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type FormFields = z.infer<typeof schema>;

export const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [signUp] = useMutation(SIGN_UP);
    const imageUrl =
        "https://ik.imagekit.io/webibee/newlogo2.png?updatedAt=1730964119061";
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
        mode: "onBlur",
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // console.log("submitted", data);

        try {
            const { data: result } = await signUp({ variables: { ...data } });

            const response = await fetch("/api/sendMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipientEmail: `${data.email}`,
                    recipientType: "client",
                    employeeId: `${data.email}`,
                    subject2: `ENSILETA INTERIORS- Welcome ${data.username}`,
                    message2: `<h4>Hello ${data.username},</h4>
      <p>
        Congratulations on successfully signing up for ${data.company_name}! Your account is now active, and you can begin exploring our services and resources. You can seamlessly review the drawings and obtain approval, all in one place.
      </p>
      <p>
        If you need assistance or have any questions about your account, feel free to contact our support team.
      </p>
      <p>Thank you for joining us. We’re excited to have you on board!</p>`,
                    subject1: `New Client Form Submitted - ${data.company_name}`,
                    message1: `
                    <div class="block space-y-10 font-merriWeather">
                    <h4 class="!text-lg !capitalize">Hi,</h4>
                    <p>You have a new Client Form Submission</p>
                    <p class="!flex !items-center !justify-center !gap-3">
                    <span class="!capitalize !font-bold">Name:</span> 
                    ${data.username}
                    </p>
                    <p>Company: ${data.company_name}</p>
                    <p>Email: ${data.email}</p>
                    <p>Department: ${data.department}</p>
                    <p>Phone Number: ${data.phone_number}</p>
                    <p>Address: ${data.address}</p>
                    <br/>
                    <br/>
                    <p>Thanks</p>
                    </div> 
                    `,
                }),
            });

            if (!response.ok) {
                // const errorData = await response.text();
                throw new Error(`Error: please reload and try again`);
            }
            const allData = await response.json();

            if (result && allData.success) {
                router.push("/api/auth/signin");
                toast.success("Signed up successfully", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: "1px solid #65a34e",
                        padding: "16px",
                        color: "#65a34e",
                    },
                    iconTheme: {
                        primary: "#65a34e",
                        secondary: "#FFFAEE",
                    },
                });
            } else {
                setError("root", { message: "Invalid Sign Up" });
                toast.error("Invalid Sign Up", {
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
        } catch (error: any) {
            console.error("An unexpected error occurred:", error);
            setError("root", { message: error.message });
            toast.error(error.message, {
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
        <div className="rounded-md border-4 border-secondary bg-white shadow-xl m-4">
            <div className="flex flex-wrap items-start relative">
                <div className="hidden w-full xl:block xl:w-1/2 lg:sticky lg:top-0 py-4 sm:py-12.5 xl:py-17.5">
                    <div className="p-4 sm:px-16 sm:py-0 space-y-5 text-center flex justify-center items-center flex-col">
                        <div className="w-64 h-14 relative items-center flex justify-center mb-8">
                            <Image alt="logo" src={"/logo/newlogo.png"} fill priority sizes="(min-width: 1380px) 256px, (min-width: 1280px) calc(63.75vw - 611px), 242px" />
                        </div>
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

                <div className="w-full p-4 sm:px-6 sm:py-0 xl:w-1/2 xl:border-l-2">
                    <div className="w-full px-4 py-7 sm:p-12.5 xl:p-17.5 text-[#0E132A]">
                        {/* <span className="mb-1.5 block font-medium text-sm md:text-base">Start for free</span> */}
                        <h2 className="mb-6 text-lg font-bold text-[#0E132A] md:text-2xl">
                            Create a New Account
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative">
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Name
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-sm sm:placeholder:text-base sm:pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("username")}
                                        />

                                        <span className="hidden sm:block absolute right-4 top-2">
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
                                    <div className="absolute -bottom-6 left-0 w-full text-xs md:text-sm text-warning font-semibold text-center mt-1">
                                        {errors.username.message}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Company
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Enter your Company Name"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-sm sm:placeholder:text-base sm:pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("company_name")}
                                        />

                                        <span className="hidden sm:block absolute right-4 top-2">
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
                                    <div className="absolute -bottom-8 sm:-bottom-6 left-0 w-full text-xs md:text-sm text-warning font-semibold text-center mt-1">
                                        {errors.company_name.message}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="flex gap-3 items-center ">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Email
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-sm sm:placeholder:text-base sm:pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("email")}
                                        />

                                        <span className="hidden sm:block absolute right-4 top-2">
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
                                    <div className="text-warning font-semibold text-center absolute -bottom-6 left-0 w-full text-xs md:text-sm mt-1">
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Department
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Enter Your Department"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-sm sm:placeholder:text-base sm:pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("department")}
                                        />
                                        <span className="hidden sm:block absolute right-4 top-2">
                                            <svg
                                                className="fill-current"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <title>group_line</title>
                                                <g
                                                    id="页面-1"
                                                    opacity="0.5"
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <g
                                                        id="Development"
                                                        transform="translate(-768.000000, 0.000000)"
                                                    >
                                                        <g
                                                            id="group_line"
                                                            transform="translate(768.000000, 0.000000)"
                                                        >
                                                            <path
                                                                d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                                                                id="MingCute"
                                                                fillRule="nonzero"
                                                            ></path>
                                                            <path
                                                                d="M15,6 C15,7.30622 14.1652,8.41746 13,8.82929 L13,11 L16,11 C17.6569,11 19,12.3431 19,14 L19,15.1707 C20.1652,15.5825 21,16.6938 21,18 C21,19.6569 19.6569,21 18,21 C16.3431,21 15,19.6569 15,18 C15,16.6938 15.8348,15.5825 17,15.1707 L17,14 C17,13.4477 16.5523,13 16,13 L8,13 C7.44772,13 7,13.4477 7,14 L7,15.1707 C8.16519,15.5825 9,16.6938 9,18 C9,19.6569 7.65685,21 6,21 C4.34315,21 3,19.6569 3,18 C3,16.6938 3.83481,15.5825 5,15.1707 L5,14 C5,12.3431 6.34315,11 8,11 L11,11 L11,8.82929 C9.83481,8.41746 9,7.30622 9,6 C9,4.34315 10.3431,3 12,3 C13.6569,3 15,4.34315 15,6 Z M12,5 C11.4477,5 11,5.44772 11,6 C11,6.55228 11.4477,7 12,7 C12.5523,7 13,6.55228 13,6 C13,5.44772 12.5523,5 12,5 Z M6,17 C5.44772,17 5,17.4477 5,18 C5,18.5523 5.44772,19 6,19 C6.55228,19 7,18.5523 7,18 C7,17.4477 6.55228,17 6,17 Z M18,17 C17.4477,17 17,17.4477 17,18 C17,18.5523 17.4477,19 18,19 C18.5523,19 19,18.5523 19,18 C19,17.4477 18.5523,17 18,17 Z"
                                                                id="形状"
                                                                fill="#09244B"
                                                            ></path>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                {errors.department && (
                                    <span className="text-warning font-semibold text-center absolute -bottom-8 sm:-bottom-6 left-0 w-full text-xs md:text-sm mt-2">
                                        {errors.department.message}
                                    </span>
                                )}
                            </div>
                            {/* Phone Number */}
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Phone Number
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Enter Your Ph.No."
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-sm sm:placeholder:text-base sm:pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("phone_number")}
                                        />
                                        <span className="hidden sm:block absolute right-4 top-2">
                                            <FaPhoneVolume className="fill-current text-[18px] opacity-50" />
                                        </span>
                                    </div>
                                </div>
                                {errors.phone_number && (
                                    <span className="text-warning font-semibold text-center absolute -bottom-6 left-0 w-full text-xs md:text-sm mt-2">
                                        {errors.phone_number.message}
                                    </span>
                                )}
                            </div>
                            {/* Address */}
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Address
                                    </label>
                                    <div className="relative flex-grow">
                                        <textarea
                                            placeholder="Enter Your address"
                                            rows={3}
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-sm sm:placeholder:text-base sm:pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("address")}
                                        />
                                        <span className="hidden sm:block absolute right-4 top-8">
                                            <FaRegAddressBook className="fill-current text-[18px] opacity-50" />
                                        </span>
                                    </div>
                                </div>
                                {errors.address && (
                                    <span className="text-warning font-semibold text-center absolute -bottom-6 left-0 w-full text-xs md:text-sm mt-2">
                                        {errors.address.message}
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Password
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="6+ Characters, 1 Capital letter"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-sm sm:placeholder:text-base sm:pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("password")}
                                        />

                                        <span
                                            className="hidden sm:block absolute right-4 top-2 cursor-pointer"
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
                                </div>
                                {errors.password && (
                                    <div className="text-warning font-semibold text-center absolute -bottom-6 left-0 w-full text-xs md:text-sm mt-1">
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Re-type Password
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-sm sm:placeholder:text-base sm:pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("confirmPassword")}
                                        />

                                        <span
                                            className="hidden sm:block absolute right-4 top-2 cursor-pointer"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
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
                                </div>
                                {errors.confirmPassword && (
                                    <div className="text-warning font-semibold text-center absolute -bottom-8 sm:-bottom-6 left-0 w-full text-xs md:text-sm mt-1">
                                        {errors.confirmPassword.message}
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                    className={`w-full cursor-pointer  p-4 text-white transition  bg-secondary mb-5 ${!isValid || isSubmitting
                                        ? "bg-opacity-40 cursor-not-allowed"
                                        : "hover:bg-opacity-90"
                                        }`}
                                >
                                    {isSubmitting ? <Loader2 /> : "Sign up"}
                                </button>
                            </div>

                            <div className="text-center !-mt-2 ">
                                <p>
                                    Already have an account?{" "}
                                    <Link href="/api/auth/signin" className="text-secondary">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                            {errors.root && (
                                <div className="absolute -bottom-10 text-sm md:text-base w-full left-1/2 -translate-x-1/2 text-warning font-semibold text-center mt-5">
                                    {errors.root.message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
