'use client'
import React, { useActionState, useRef, useState, useEffect } from 'react'
import { uploadBookCover } from '../api/book/route';
import Image from 'next/image';

interface BookDataProps {
    _id: String,
    coverPath?: String,
    name: String,
    description: String,
    rating: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    state: ['unread', 'reading', 'finished'],
    onDelete: Function
}

const BookCard = (bookData: BookDataProps) => {
    const [uploadBookCoverState, uploadBookCoverAction, uploadBookCoverPending] = useActionState(uploadBookCover, undefined);
    const formRef = useRef<HTMLFormElement>(null);
    const [coverPath, setcoverPath] = useState(bookData.coverPath);

    const handleBookCoverInput = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }

    const imageClickHandler = () => {
        (document.querySelector(`#_id_${bookData._id as string}`) as HTMLElement).click();
    }

    const bookDeleteHandler = () => {
        bookData.onDelete(bookData._id as string);
    }

    useEffect(() => {
        if(uploadBookCoverState?.coverPath){
            setcoverPath(uploadBookCoverState?.coverPath);
        }
    }, [uploadBookCoverState]);
    
    return (
    <><div className="bg-white rounded-lg shadow-lg overflow-hidden transition hover:shadow-xl w-72">

            <div className='relative h-40 cursor-pointer' hidden={!coverPath}>
                <Image src={`/api/book/cover?_id=${bookData._id}`} alt='' fill 
                    onClick={imageClickHandler}/>

            </div>

            <form action={uploadBookCoverAction} hidden={!!coverPath} ref={formRef} className="space-y-4">
                <div>
                    <label htmlFor={`_id_${bookData._id as string}`} className="h-40 cursor-pointer bg-green-600 flex items-center justify-center text-white text-4xl font-bold">Select Image</label>
                    <input type="file" name="bookCover" id={`_id_${bookData._id as string}`} required onChange={handleBookCoverInput}
                     accept='image/jpeg,image/jpg,image/png,image/webp' hidden
                    />
                    <input name='_id' type="text" defaultValue={bookData._id as string} hidden />
                </div>
            </form>
            <div className="relative p-4">
                <button className='absolute px-2 py-0.5 rounded-full right-0 mr-3 mt-0.5 bg-gray-800 hover:bg-black cursor-pointer text-sm font-medium text-white'
                  onClick={bookDeleteHandler}
                >X</button>
                <h3 className="text-lg font-bold">{bookData.name}</h3>
                <p className="text-gray-500 text-sm mt-1">
                    {
                        bookData.state as unknown as string === 'unread' 
                        ? 'Não lido'
                        : bookData.state as unknown as string === 'reading'
                          ? 'Lendo' 
                          : `Terminado --- ${bookData.rating}`
                    }
                </p>
            </div>
    </div></>
    )
}

export default BookCard