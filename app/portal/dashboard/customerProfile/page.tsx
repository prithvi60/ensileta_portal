"use client"
import { CustomerInfoForm } from '@/components/customer_info/CustomerInfoForm'
import DefaultLayout from '@/components/Layout/DefaultLayout'
import { Loader } from '@/components/Loader'
import { GET_USER } from '@/lib/Queries'
import { useQuery } from '@apollo/client'
import Image from 'next/image'


const Page = () => {
    const { data, loading } = useQuery(GET_USER);

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                {loading ? (<div className='w-full h-screen'>
                    <Loader />
                </div>) : (<>
                    {data?.user?.role === "admin" || data?.user?.role === "super admin" ? (<div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default">
                        <div className="relative z-20 h-35 md:h-65">
                            <Image
                                src={"/cover/banner-img.jpg"}
                                alt="profile cover"
                                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-bottom overflow-hidden"
                                width={970}
                                height={260}
                            />
                        </div>
                        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                            {/* <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                                <div className="relative drop-shadow-2">
                                    <Image
                                        src={"/user/user-06.png"}
                                        width={160}
                                        height={160}
                                        style={{
                                            width: "auto",
                                            height: "auto",
                                        }}
                                        alt="profile"
                                    />
                                </div>
                            </div> */}
                            <h3 className='pt-10 pb-6 w-full h-full text-center text-xl font-semibold tracking-wider'>Your Profile</h3>
                            <div className="mt-4">
                                {/*Company  Form  */}
                                <CustomerInfoForm />
                            </div>
                        </div>
                    </div>) : (
                        <div className='w-full h-full shadow-md rounded-md p-5 font-medium tracking-wide text-rose-500 text-xl'>
                            <p className='text-center'>Hey team, just a friendly reminder that employees should avoid visiting this page. Thanks for your cooperation!</p>
                        </div>
                    )}
                </>)}


            </div>
        </DefaultLayout>
    )
}

export default Page


{/* {session?.user ? (
                                <div className='py-5 px-10 space-y-6'>
                                    <div className='flex items-center gap-3'>
                                        <h4 className='text-lg font-semibold'>Company Name:</h4>
                                        <p>Ensileta</p>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <h4 className='text-lg font-semibold'>Phone Number:</h4>
                                        <p>9977665544</p>
                                    </div>
                                    <div className='flex items-start gap-3'>
                                        <h4 className='text-lg font-semibold'>Address:</h4>
                                        <p>#493 Bangalore High Road, Varadharajapuram Poonamallee, Chennai - 56 (opp to Panimalar Engg College)</p>
                                    </div>
                                </div>


                            ) : (<CustomerInfoForm />)} */}