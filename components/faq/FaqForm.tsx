import React from 'react'

export const FaqForm = () => {
    return (
        <div className='w-full sm:w-1/2 mx-auto mt-10 bg-primary p-10 space-y-6'>
            <h3 className='text-xl font-semibold text-white text-center w-full capitalize'>Need any help?</h3>
            <h4 className=' text-white '>We will get back within 24 hours incase of any queries!</h4>
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
                        Submit
                    </button>
                </div>

            </form>
        </div>
    )
}
