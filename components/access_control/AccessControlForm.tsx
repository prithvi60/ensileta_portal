"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_EMPLOYEE, GET_EMPLOYEE_LISTS, GET_USER } from "@/lib/Queries";
import Loader2 from "../Loader2";
import { FaPhoneVolume } from "react-icons/fa6";

const schema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(100, { message: "Username must be less than 30 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    department: z
        .string()
        .min(2, { message: "Department name must be at least 2 characters long" })
        .max(50, { message: "Department name must be less than 30 characters" }),
    password: z.string().min(6),
    phone_number: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must not exceed 10 digits"),
});

type FormFields = z.infer<typeof schema>;

const AccessControlForm = () => {
    const { data: RoleBased } = useQuery(GET_USER);
    const [showPassword, setShowPassword] = useState(false);
    const [employeeData] = useMutation(ADD_EMPLOYEE, {
        refetchQueries: [{ query: GET_EMPLOYEE_LISTS, variables: { company_name: RoleBased?.user?.company_name } }],
        awaitRefetchQueries: true,
    });
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // console.log(data);
        try {
            const result = await employeeData({
                variables: {
                    username: data.username,
                    email: data.email,
                    department: data.department,
                    password: data.password,
                    company_name: RoleBased?.user?.company_name,
                    phone_number: data.phone_number
                },
            });


            const response = await fetch("/api/sendMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipientEmail: `${RoleBased?.user?.email}`,
                    recipientType: "client",
                    employeeId: `${data.email}`,
                    subject2: `ENSILETA INTERIORS- Welcome ${data.username}`,
                    message2: `
                            <h2>Hello ${data.username},</h2>
              <p>
                We are pleased to inform you that a new email and password have been successfully created for your account. You can now use this login information to access your employee portal.
              </p>
              <div>
              <p><strong>Email Id:</strong> ${data.email}</p>
                  <p><strong>Password:</strong> ${data.password}</p>
                  <p><strong>Phone Number:</strong> ${data.phone_number}</p>
              </div>
              <p>
                For security reasons, please ensure that you change your password upon first login. If you encounter any issues or have questions, don’t hesitate to reach out to us.
              </p>
              <p>Thank you, and welcome aboard!</p>
                        `,
                    subject1: `New Team Member Added by ${RoleBased?.user?.company_name}`,
                    message1: `
              <p>
                We are pleased to inform you that a new email and password have been successfully created by <strong> ${RoleBased?.user?.company_name}</strong> for new Team member.
              </p>
              <div>
              <p><strong>Email Id:</strong> ${data.email}</p>
               <p><strong>Phone Number:</strong> ${data.phone_number}</p>
              </div>
                        `
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error: Error: please reload and try again`);
            }

            const allData = await response.json();

            if (!result && !allData) {
                setError("root", { message: "unable to create a employee" });
                toast.error("no employee list uploaded", {
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
                toast.success("Employee Uploaded successfully", {
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
                reset();
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
        <div className="bg-white shadow-xl m-4">
            {RoleBased?.user?.role === "admin" && (
                <div className="flex justify-center flex-wrap items-center">
                    <div className="w-full sm:p-4 sm:px-16 sm:py-0 xl:w-3/4">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5 text-[#0E132A]">
                            <h2 className="mb-9 text-2xl font-bold text-[#0E132A] sm:text-title-xl2 text-center">
                                Add a Team Member to the Ensileta Portal confidently
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <div>
                                        <label className="mb-2.5 block font-medium text-[#0E132A]">
                                            Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Enter your full name"
                                                className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                                {...register("username")}
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
                                        <div className="text-warning font-semibold text-center text-sm mt-1">
                                            {errors.username.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
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
                                        <div className="text-warning font-semibold text-center mt-1">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2.5 w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Department
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Enter Your Department"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
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
                                    {errors.department && (
                                        <span className="text-warning font-semibold text-center mt-2">
                                            {errors.department.message}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2.5 w-[45%] md:w-[30%] block font-medium text-[#0E132A] text-sm md:text-base">
                                        Phone Number
                                    </label>
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Enter Your Phone Number"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                            {...register("phone_number")}
                                        />
                                        <span className="hidden sm:block absolute right-4 top-2">
                                            <FaPhoneVolume className="fill-current text-[18px] opacity-50" />
                                        </span>
                                    </div>
                                    {errors.phone_number && (
                                        <span className="text-warning font-semibold text-center mt-2">
                                            {errors.phone_number.message}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                                        Create Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="6+ Characters, 1 Capital letter"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
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
                                        <div className="text-warning font-semibold text-center mt-1">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full cursor-pointer p-4 text-white hover:bg-opacity-90 bg-secondary mb-5 transition-all duration-500 ease-in-out"
                                >
                                    {isSubmitting ? <Loader2 /> : "Submit"}
                                </button>

                                {errors.root && (
                                    <div className="text-warning font-semibold text-center mt-5">
                                        {errors.root.message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessControlForm;
