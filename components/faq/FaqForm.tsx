import React from 'react'

export const FaqForm = () => {
    return (
        <div className='w-full sm:w-1/2 mx-auto mt-10 bg-primary p-10'>
            <h3 className='text-xl font-semibold text-white text-center w-full'>Get Free Consultation</h3>
            <form >
                {/* User Name */}
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-white ">
                        Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter your User Name"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none placeholder:text-slate-300 placeholder:text-sm focus:border-secondary focus-visible:shadow-none"
                        // {...register("username")} 
                        />
                        {/* {errors.username && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.username.message}</span>
                        )} */}
                    </div>
                </div>
                {/* Email ID */}
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-white">
                        Email Id
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your Email Id"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none placeholder:text-slate-300 placeholder:text-sm focus:border-secondary focus-visible:shadow-none"
                        // {...register("email")} 
                        />
                        {/* {errors.email && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.email.message}</span>
                        )} */}
                    </div>
                </div>
                {/* Company Name */}
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-white">
                        Company Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter your Company Name"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none placeholder:text-slate-300 placeholder:text-sm focus:border-secondary focus-visible:shadow-none"
                        // {...register("companyName")} 
                        />
                        {/* {errors.companyName && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.companyName.message}</span>
                        )} */}
                    </div>
                </div>
                {/* Phone Number */}
                <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-white">
                        Phone Number
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter Your Ph.No."
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none placeholder:text-slate-300 placeholder:text-sm focus:border-secondary focus-visible:shadow-none"
                        // {...register('phoneNo')} 
                        />
                        {/* {errors.phoneNo && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.phoneNo.message}</span>
                        )} */}
                    </div>
                </div>
                {/* Address */}
                <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-white">
                        Message
                    </label>
                    <div className="relative">
                        <textarea
                            placeholder="Enter Your Message"
                            rows={3}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none placeholder:text-slate-300 placeholder:text-sm focus:border-secondary focus-visible:shadow-none"
                        // {...register('address')} 
                        />
                        {/* {errors.address && (
                            <span className="text-warning font-semibold text-center mt-2">{errors.address.message}</span>
                        )} */}
                    </div>
                </div>
                {/* Submit */}
                <div className="mb-5 mx-auto ">
                    <button
                        // disabled={!isDirty}
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
