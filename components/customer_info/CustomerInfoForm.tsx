"use client"
import React, { useState } from 'react'

export const CustomerInfoForm = () => {
    const [companyName, setCompanyName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return (
        <div className='w-full sm:w-1/2 mx-auto mt-10'>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                        Company Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter your Company Name"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-[#0E132A]">
                        Phone Number
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Your Ph.No."
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-[#0E132A] outline-none focus:border-primary focus-visible:shadow-none"
                            required value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />

                    </div>
                </div>

                <div className="mb-5 mx-auto w-1/2">
                    <input
                        type="submit"
                        value="Sign In"
                        className="w-full cursor-pointer rounded-lg p-4 text-white transition hover:bg-opacity-90 bg-[#139F9B]"
                    />
                </div>

            </form>
        </div>
    )
}
