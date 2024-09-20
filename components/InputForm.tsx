"use client"

import { ChangeEvent, FormEvent } from "react";

interface InputFormProps {
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    inputValue: string
}

export const InputForm: React.FC<InputFormProps> = ({ handleChange, handleSubmit, inputValue }) => {

    return (
        <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col gap-5 w-full text-center'>
            {/* <div className='block'> */}
            <label htmlFor="input" className=' select-none text-lg'>Type Your File Name</label>
            <input
                id='input'
                type="text"
                value={inputValue}
                onChange={handleChange}
                className='border-2 rounded-full p-3'
            />
            <button type="submit" className='cursor-pointer p-3 shadow-md select-none bg-secondary text-white rounded-md '>Upload File Name</button>
        </form>
    )
}
