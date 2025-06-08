import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { ModeToggle } from './toggle'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
    await checkUser();
    return (
        <div className='top-0 fixed w-full bg-bg1/50 z-50 backdrop-blur-md border-b border-text/10'>
            <nav className='container mx-auto px-4 flex items-center justify-between'>
                <Link href="/">
                    <Image
                        priority
                        src={"/logo.png"}
                        alt="tracksy"
                        height={60}
                        width={200}
                        className="h-12 w-auto object-contain bg-white rounded-[0.5rem] px-5 my-2 shadow-2xl hover:bg-gray-100 duration-300"
                    />
                </Link>

                <div className='flex items-center space-x-4'>
                    <SignedIn>
                        <Link href={"/dashboard"} className='flex items-center gap-2'>
                            <Button variant="outline">
                                <LayoutDashboard size={18} />
                                <span className='hidden md:inline'>Dashboard</span>
                            </Button>
                        </Link>
                        <Link href={"/transaction/create"} className='flex items-center gap-2'>
                            <Button>
                                <PenBox size={18} />
                                <span className='hidden md:inline'>Add Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                    </SignedOut>
                    <ModeToggle />
                    <SignedIn >
                        <UserButton appearance={{
                            elements: {
                                userButtonAvatarBox: {
                                    width: '2.5rem',
                                    height: '2.5rem',
                                },
                            },
                        }} />
                    </SignedIn>
                </div>

            </nav>
        </div>
    )
}

export default Header;