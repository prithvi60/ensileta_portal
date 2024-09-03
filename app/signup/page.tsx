import { Button } from '@nextui-org/button';
import { Input } from "@nextui-org/input";
const page = () => {
    return (
        <main className="flex items-center justify-center w-full h-screen bg-indigo-500">
            <form action={""} className='block space-y-5 text-center'>
                <h2 className="font-serif text-5xl font-bold tracking-widest caption-top">SignUp</h2>
                <Input type="text" size='sm' isClearable label="Name" placeholder='Enter your Name' />
                <Input type="email" size='sm' isClearable label="Email" placeholder='Enter your Valid Email' />
                <Input type="text" label="Password" size='sm' placeholder='Enter your Valid Password' />
                <Button color='primary' type='reset'>Login</Button>
            </form>
        </main>
    )
}

export default page
