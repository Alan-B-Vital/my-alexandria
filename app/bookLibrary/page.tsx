"use client";

import { useActionState, useEffect, useState } from "react";
import { createBook } from "@/app/api/book/route";
import BookCard from "../components/bookCard";
import { BookDataProps } from "./bookDefinitions";

export default function BookForm() {
    const [createBookState, createBookAction, createBookPending] = useActionState(createBook, undefined);
    const [createBookModal, setCreateBookModal] = useState(false);

    const [userBooks, setUserBooks] = useState([]);

    useEffect(() => {
        if (createBookState?.errors) { // keep modal open if any errors
            return;
        }

        setCreateBookModal(false);
    }, [createBookState]);

    const fetchUserBooks = async () => {
        let bookData = (await fetch('/api/book', {
            method: 'GET',
            credentials: 'include'
        })).json();
        return bookData;
    }

    useEffect(() => {
        fetchUserBooks().then((bookData) => {
            setUserBooks(bookData);
        });
    }, [createBookState]);

    const renderBookCard = (book: any) => {
        return (
            <BookCard key={book._id}
              _id={book._id}
              coverPath={book.coverPath}
              name={book.name}
              description={book.description}
              rating={book.rating}
              state={book.state}
              onDelete={handleBookEvent} 
            ></BookCard>
        )
    }

    const handleBookEvent = (bookId: string) => {
        fetch(`/api/book?_id=${bookId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((response) => {
                fetchUserBooks().then((bookData) => {
                    setUserBooks(bookData);
                });
            });
    }

    return (
        <>
        <div className="p-4 text-xl">
            <h1 className="text-4xl mb-1">Biblioteca de Livros</h1>

            <p className="">Salve aqui seus livros</p>
        </div>
        <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-6 p-6">
            {userBooks && userBooks.map((book) => renderBookCard(book))}
            <div onClick={() => setCreateBookModal(true)}
              className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transition hover:shadow-xl w-72"
            >
                <div className="h-40 bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                    +
                </div>
                <div className="p-4">
                    <p className="text-gray-600 text-sm mb-1">Adicionar</p>
                    <h3 className="text-lg font-bold">Novo Livro</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Clique para cadastrar um novo livro.
                    </p>
                </div>
            </div>
        </div>

        {/* Modal do formulário */}
        {createBookModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Cadastrar Livro</h2>
                    <form action={createBookAction} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome do livro <span className="text-red-500">*</span></label>           
                            <input type="text" name="name" id="name" placeholder="Livro de fogo e gelo" required 
                            defaultValue={createBookState?.values?.name as string || ""}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            />
                            {createBookState?.errors?.name && <p className='block mb-2 text-sm font-medium text-red-800 dark:text-red-400'>{createBookState.errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Breve descrição</label> 
                            <textarea name="description" id="description" placeholder="Descrição" 
                            defaultValue={createBookState?.values?.description as string || ""}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            />
                            {createBookState?.errors?.description && <p className='block mb-2 text-sm font-medium text-red-800 dark:text-red-400'>{createBookState.errors.description}</p>}
                        </div>
                        <div className="w-full flex justify-between">
                            <div className="w-full">
                                <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nota</label> 
                                <input type="number" name="rating" id="rating" 
                                defaultValue={createBookState?.values?.rating as string || 0} min={0} max={10}
                                className="block bg-gray-50 w-20 mr-2 p-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                />
                                {createBookState?.errors?.rating && <p className='block mb-2 text-sm font-medium text-red-800 dark:text-red-400'>{createBookState.errors.rating}</p>}
                            </div>
                            <div>
                                <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status <span className="text-red-500">*</span></label> 
                                <select name="state" id="state" required 
                                defaultValue={createBookState?.values?.state as string || "unread"}
                                className="bg-gray-50 w-80 p-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                >
                                    <option value={'unread'}>Não Lido</option>
                                    <option value={'reading'}>Lendo</option>
                                    <option value={'finished'}>Terminado</option>
                                </select>
                                {createBookState?.errors?.state && <p className='block mb-2 text-sm font-medium text-red-800 dark:text-red-400'>{createBookState.errors.state}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button"
                              onClick={() => setCreateBookModal(false)}
                              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button type="submit" disabled={createBookPending} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
}