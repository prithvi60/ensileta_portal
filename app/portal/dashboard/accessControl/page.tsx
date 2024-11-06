
import DefaultLayout from '@/components/Layout/DefaultLayout';
import AccessControlForm from '@/components/access_control/AccessControlForm';
import { EmployeeLists } from '@/components/access_control/EmployeeLists';



const Page = () => {

    return (
        <DefaultLayout>
            <section className='h-full w-full space-y-10'>
                <AccessControlForm />
                <EmployeeLists />
            </section>
        </DefaultLayout>
    )
}

export default Page