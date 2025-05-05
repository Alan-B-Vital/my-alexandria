'use server'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import UserMenu from '../components/UserMenu'

const Navbar = () => {
    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link href="/" className="ml-2">
                                <Image className="h-8 w-auto" width={80} height={80} src="/logo.svg" alt="Your Company" />
                            </Link>

                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href="/bookLibrary" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Livros</Link>
                            </div>
                        </div>
                    </div>
                    <UserMenu></UserMenu>
                </div>
            </div>

            <div className="sm:hidden" id="mobile-menu"> 
                <div className="space-y-1 px-2 pt-2 pb-3">
                    <Link href="/bookLibrary" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Livros</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar