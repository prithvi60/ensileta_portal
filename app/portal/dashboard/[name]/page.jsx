import DefaultLayout from '@/components/Layout/DefaultLayout';
import { SATable } from '@/components/superAdminTable/SATable';
import React from 'react'

const Page = ({ params }) => {
  const { name } = params;

  return (
    <DefaultLayout>
      <section className='h-full w-full'>
        <SATable name={name} />
      </section>
    </DefaultLayout>
  )
}

export default Page
