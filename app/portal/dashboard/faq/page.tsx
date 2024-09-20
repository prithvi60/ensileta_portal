import { BasicFAQ } from "@/components/faq/FaqAccordion"
import { FaqForm } from "@/components/faq/FaqForm"
import DefaultLayout from "@/components/Layout/DefaultLayout"

const Page = () => {
    return (
        <DefaultLayout>
            <section className='h-full w-full'>
                <BasicFAQ />
                <FaqForm />
            </section>
        </DefaultLayout>

    )
}

export default Page
