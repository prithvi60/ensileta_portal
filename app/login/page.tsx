import { Button } from '@nextui-org/button';
import { Input } from "@nextui-org/input";

export default function Page() {
    return (
        <main className="flex items-center justify-center w-full h-screen bg-purple-800">
            <form action={""} className='block space-y-5 text-center'>
                <h2 className="font-serif text-5xl font-bold tracking-widest caption-top">Login</h2>
                <Input type="email" size='sm' isClearable label="Email" placeholder='Enter your Valid Email' />
                <Input type="text" label="Password" size='sm' placeholder='Enter your Valid Password' />
                <Button color='primary' type='reset'>Login</Button>
            </form>
        </main>
    );
}
