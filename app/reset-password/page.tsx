import { Suspense } from 'react'
import ResetPasswordPage from '@/components/ResetPassword'
import { Loader } from '@/components/Loader'

const page = () => {
    return (
        <main className='flex justify-center items-center h-screen w-full bg-primary p-5'>
            <Suspense fallback={<div><Loader /></div>}>
                <ResetPasswordPage />
            </Suspense>
        </main>
    )
}

export default page
