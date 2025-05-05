'use client'
import { signup, signin, logout } from '@/app/actions/auth'
import { verifySession } from '../lib/session';
import { redirect } from 'next/navigation';
import React, { useState, useEffect, useActionState } from 'react';
import Image from 'next/image';
import Link from 'next/link'

const Navbar = () => {
    const [userMenuState, toggleUserMenuState] = useState(false);
    const [signinMenuState, toggleSigninMenuState] = useState(false);
    const [signupMenuState, toggleSignupMenuState] = useState(false);

    const [signupPasswordVisible, toggleSignupPasswordVisible] = useState(false);
    const [signinPasswordVisible, toggleSigninPasswordVisible] = useState(false);
    const [signupPasswordRequirements, setSignupPasswordRequirements] = useState({
        minChar: false,
        letter: false,
        number: false,
        special: false
    });

    const [signinState, signinAction, signinPending] = useActionState(signin, undefined); // Login
    const [signupState, signupAction, signupPending] = useActionState(signup, undefined); // Cadastro

    const [userIsLogged, setUserIsLogged] = useState<boolean>(false);
    
    const checkSession = async () => {
        const sessionIsValid = await verifySession();
        setUserIsLogged(sessionIsValid);
    };

    const resetAllMenus = () => {
        toggleUserMenuState(false);
        toggleSigninMenuState(false);
        toggleSignupMenuState(false);
    }

    const handleLogOutButton = async () => {
        await logout();
        await checkSession()
        redirect('/')
    }

    const handlePasswordChangeInput = (event: React.ChangeEvent) => {
        const pass: string =  (event.target as HTMLInputElement).value

        let requirements = signupPasswordRequirements;

        requirements = {
            minChar: RegExp(/.{8,}/).test(pass),
            letter: RegExp(/[A-Za-z]/).test(pass),
            number: RegExp(/\d/).test(pass),
            special: RegExp(/[^A-Za-z0-9]/).test(pass)
        }

        setSignupPasswordRequirements(requirements);
    }

    useEffect(() => {
        checkSession();
    }, [signinState, signupState]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            resetAllMenus();
          }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

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
                                {userIsLogged && <Link href="/bookLibrary" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Livros</Link>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {!userIsLogged && (
                            <div className="relative">
                                <div className="flex space-x-4">
                                    <button type="button" 
                                        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true"
                                        onClick={() => {resetAllMenus();toggleSigninMenuState(!signinMenuState)}}>
                                            Entrar
                                    </button>
                                    <button type="button" 
                                        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true"
                                        onClick={() => {resetAllMenus();toggleSignupMenuState(!signupMenuState)}}>
                                            Cadastrar
                                    </button>
                                </div>
                                {signinMenuState && (
                                    <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden" 
                                        role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                        <form action={signinAction} className='px-4 py-2'>
                                            <div className='mb-6'>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                                <input type="email" name="email" id="email" placeholder="john.doe@company.com" required 
                                                    defaultValue={signinState?.values?.email as string || ""}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                />
                                            </div>
                                            <div  className='mb-6'>
                                                <label htmlFor="password" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white justify-between">
                                                    <span>Senha</span>
                                                    <Image src='/eye-outline.svg' alt='Botão senha visível' width={20} height={20} className='mr-1' onClick={() => toggleSigninPasswordVisible(!signinPasswordVisible)}></Image>
                                                
                                                </label>
                                                <input id="password" name="password" type={signinPasswordVisible? 'text' : 'password'} required
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    
                                                />
                                            </div>
                                            {signinState?.message && <p className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>{signinState.message}</p>}
                                            <button type="submit" disabled={signinPending}
                                                className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
                                                Enviar
                                            </button>
                                        </form>
                                    </div>
                                )}
                                {signupMenuState && (
                                    <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden" 
                                        role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                        <form action={signupAction} className='px-4 py-2'>
                                            <div className='mb-6'>
                                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                                <input type="text" name="name" id="name" placeholder="john Doe" required
                                                    defaultValue={signupState?.values?.name as string || ""}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                />
                                                {signupState?.errors?.name && <p className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>{signupState.errors.name}</p>}
                                            </div>
                                            <div className='mb-6'>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                                <input type="text" name="email" id="email" placeholder="john.doe@company.com" required
                                                    defaultValue={signupState?.values?.email as string || ""}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                />
                                                {signupState?.errors?.email && <p className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>{signupState.errors.email}</p>}
                                            </div>
                                            <div  className='mb-6'>
                                                <label htmlFor="password" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white justify-between">
                                                    <span>Senha</span>
                                                    <Image src='/eye-outline.svg' alt='Botão senha visível' width={20} height={20} className='mr-1' onClick={() => toggleSignupPasswordVisible(!signupPasswordVisible)}></Image>
                                                </label>
                                                <input id="password" name="password" type={signupPasswordVisible? 'text' : 'password'} required
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handlePasswordChangeInput}
                                                />
                                                <p className={
                                                    signupPasswordRequirements.minChar 
                                                        ? 'block ml-2 my-1 text-sm font-medium text-green-700 dark:text-green-400'
                                                        : 'block ml-2 my-1 text-sm font-medium text-gray-900 dark:text-white'
                                                }>Ter 8 ou mais caracteres</p>
                                                <p className={
                                                    signupPasswordRequirements.letter 
                                                        ? 'block ml-2 mb-1 text-sm font-medium text-green-700 dark:text-green-400'
                                                        : 'block ml-2 mb-1 text-sm font-medium text-gray-900 dark:text-white'
                                                }>Conter ao menos uma letra</p>
                                                <p className={
                                                    signupPasswordRequirements.number 
                                                        ? 'block ml-2 mb-1 text-sm font-medium text-green-700 dark:text-green-400'
                                                        : 'block ml-2 mb-1 text-sm font-medium text-gray-900 dark:text-white'
                                                }>Conter ao menos um número</p>
                                                <p className={
                                                    signupPasswordRequirements.special 
                                                        ? 'block ml-2 mb-1 text-sm font-medium text-green-700 dark:text-green-400'
                                                        : 'block ml-2 mb-1 text-sm font-medium text-gray-900 dark:text-white'
                                                }>Conter ao menos um caracter especial</p>
                                            </div>
                                            <div  className='mb-6'>
                                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirma Senha</label>
                                                <input id="confirmPassword" name="confirmPassword" type={signupPasswordVisible? 'text' : 'password'} required
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    
                                                />
                                                {signupState?.errors?.confirmPassword && <p className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>{signupState.errors.confirmPassword}</p>}
                                            </div>
                                            {signupState?.message && <p className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>{signupState.message}</p>}
                                            <button type="submit" disabled={signupPending}
                                                className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4
                                                focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600
                                                dark:hover:bg-green-700 dark:focus:ring-green-800'
                                            >
                                                Enviar
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}
                        {userIsLogged && (<div className="relative ml-3">
                                <div className='flex justify-end items-center'>
                                    <button type="button" 
                                    className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 cursor-pointer
                                    focus:ring-offset-gray-800 focus:outline-hidden" id="user-menu-button" aria-expanded="false" aria-haspopup="true"
                                    onClick={() => {resetAllMenus();toggleUserMenuState(!userMenuState)}}>
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">Open user menu</span>
                                        <Image className="size-8 rounded-full" width={80} height={80} src="avatar.svg" alt="" />
                                    </button>
                                </div>
                                {userMenuState && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden" 
                                        role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                        <button className="block w-full text-left px-4 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex={-1} id="user-menu-item-2"
                                            onClick={handleLogOutButton}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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