"use client"
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER, GET_USERS, UPDATE_USER } from '@/lib/Queries';
import toast from 'react-hot-toast';
import { Loader } from '../Loader';

const schema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(30, { message: "Username must be less than 30 characters" }),
    email: z.string()
        .email({ message: "Invalid email address" }),
    companyName: z.string().min(3, "Company Name is required"),
    phoneNo: z.string().min(10, "Phone number must be at least 10 digits").max(10, "Phone number must not exceed 10 digits"),
    address: z.string().min(10, "Address is required"),
});

type FormData = z.infer<typeof schema>;

export const CustomerInfoForm = () => {
    const { data, loading, error } = useQuery(GET_USER);
    const [updateUser] = useMutation(UPDATE_USER);
    // const { data: usersData } = useQuery(GET_USERS);
    // console.log(usersData);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isDirty },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });


    // Pre-fill form with current user data
    useEffect(() => {
        if (data?.user) {
            const { username, email, company_name, phone_number, address } = data.user;
            setValue("username", username);
            setValue("email", email);
            setValue("companyName", company_name || "");
            setValue("phoneNo", phone_number || "");
            setValue("address", address || "");
        }
    }, [data, setValue]);

    // Handle form submission
    const onSubmit = async (formData: FormData) => {
        try {
            await updateUser({
                variables: {
                    id: data.user.id,
                    username: formData.username,
                    email: formData.email,
                    company_name: formData.companyName,
                    phone_number: formData.phoneNo,
                    address: formData.address,
                },
            });
            toast.success('User information updated successfully!', {
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
        } catch (error) {
            toast.error("Failed to update user information.", {
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
            console.error("Error updating user:", error);
        }
    };

    if (loading) return <Loader />;
    if (error) return <p>Error loading user data: {error.message}</p>;

    return (
        <div className='w-full sm:w-1/2 mx-auto mt-10'>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* User Name */}
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                        User Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter your User Name"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            {...register("username")} />
                        {errors.username && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.username.message}</span>
                        )}
                    </div>
                </div>
                {/* Email ID */}
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                        Email Id
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your Email Id"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            {...register("email")} />
                        {errors.email && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.email.message}</span>
                        )}
                    </div>
                </div>
                {/* Company Name */}
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                        Company Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter your Company Name"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            {...register("companyName")} />
                        {errors.companyName && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.companyName.message}</span>
                        )}
                    </div>
                </div>
                {/* Phone Number */}
                <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                        Phone Number
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Your Ph.No."
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            {...register('phoneNo')} />
                        {errors.phoneNo && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.phoneNo.message}</span>
                        )}
                    </div>
                </div>
                {/* Address */}
                <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                        Address
                    </label>
                    <div className="relative">
                        <textarea
                            placeholder="Enter Your address"
                            rows={3}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            {...register('address')} />
                        {errors.address && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.address.message}</span>
                        )}
                    </div>
                </div>
                {/* Submit */}
                <div className="mb-5 mx-auto ">
                    <button
                        disabled={!isDirty}
                        type="submit"
                        className="w-full cursor-pointer py-4 text-white transition hover:bg-opacity-90 bg-secondary disabled:bg-opacity-40"
                    >
                        Update
                    </button>
                </div>

            </form>
        </div>
    )
}
