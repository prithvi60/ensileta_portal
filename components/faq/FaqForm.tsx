"use client"
import React from 'react'
import toast from "react-hot-toast";

export const FaqForm = () => {
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
// console.log("data", e)
        try {
            const formData = new FormData();
            // formData.append("message", message);

            const response = await fetch("/api/uploadS3", {
                method: "POST",
                body: formData,
            });

            const res = await fetch("/api/sendMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipientEmail: `admin@example.com`,
                    subject: "New Message from User",
                    // message: `User Name: ${userName}\nMessage: ${message}`,
                }),
            });

            if (!response.ok && !res.ok) {
                throw new Error("Failed to upload file");
            }

            const data = await response.json();
            const fileUrl = data.fileUrl;
            // console.log("uploading....");

            // const result = await uploadFile({
            //     variables: { fileUrl, filename: file.name, userId },
            // });

            // console.log('File uploaded successfully:', response);
            // call query for new files
            if (response && res) {
                toast.success("We will get back shortly!", {
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
            
            }
        } catch (error: any) {
            console.error("Error sending message", error);
            toast.error("Error sending message", {
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
        <div className='w-full sm:w-1/2 mx-auto mt-10 bg-primary p-10 space-y-6'>
            <h3 className='text-xl font-semibold text-white text-center w-full capitalize'>Need any help?</h3>
            <h4 className=' text-white '>We will get back in few hours incase of any queries!</h4>
            {/* Connect form */}
            <form onSubmit={handleSubmit}>
               
                {/* Address */}
                <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-white">
                        Your query
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
