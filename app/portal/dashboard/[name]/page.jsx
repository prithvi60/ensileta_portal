"use client"
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { SATable } from '@/components/superAdminTable/SATable';
import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {
  const { name } = useParams();

  return (
    <DefaultLayout>
      {/* {loading ? (<Loader />) : ( */}
      <section className='h-full w-full'>
        <SATable name={name} />
      </section>
      {/* )} */}
    </DefaultLayout>
  )
}

export default Page
