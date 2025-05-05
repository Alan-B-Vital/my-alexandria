'use server'
import React from 'react'
import dbConnect from '@/app/lib/db';
import Book from '@/models/Book';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';
import { BookCoverFormState, BookCoverSchema, CreateBookSchema, FormState } from '@/app/bookLibrary/bookDefinitions';
import { NextRequest, NextResponse } from 'next/server';
import { join, extname } from 'path';
import { writeFile, unlink } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

export async function createBook(formstate: FormState, bookData: FormData) {
    const validatedFields = CreateBookSchema.safeParse({
        name: bookData.get('name'),
        description: bookData.get('description'),
        state: bookData.get('state'),
        rating: Number(bookData.get('rating')),
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            values: { 
                name: bookData.get('name'),
                description: bookData.get('description'),
                state: bookData.get('state'),
                rating: bookData.get('rating'),
            }
        }
    }

    const { name, description, state, rating } = validatedFields.data;

    const sessionToken = (await cookies()).get('session')?.value;
    const session = await decrypt(sessionToken);
    
    await dbConnect();
    const newbook = await Book.create({
        name: name,
        description: description,
        state: state as string,
        rating: rating,
        userId: session?.userId as string
    });

    return {
        dirty: !(formstate?.dirty ?? true) // hack para verificar sessão onReturn
    }
}


export async function uploadBookCover(formstate: BookCoverFormState, bookData: FormData) {
    const validatedFields = BookCoverSchema.safeParse({
        _id: bookData.get('_id'),
        bookCover: bookData.get('bookCover')
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const sessionToken = (await cookies()).get('session')?.value;
    const session = await decrypt(sessionToken);

    const { _id, bookCover } = validatedFields.data;
    const bytes = await bookCover.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dirPath = join(process.cwd(), 'assets', 'bookCovers', session?.userId as string);
    if (!existsSync(dirPath)){
        mkdirSync(dirPath, { recursive: true });
    }

    const bookCoverPath = join(dirPath, `${_id}${extname(bookCover.name)}`);
    await writeFile(bookCoverPath, buffer); // Estrutura de pasta -> @/assets/bookCovers/[userId]/[fileId].[file Extetion]

    await dbConnect();
    const book = await Book.findOneAndUpdate({
        _id: _id,
        userId: session?.userId as string
    }, {
        $set: {'coverPath': bookCoverPath}
    });

    if(book.coverPath) {
        await unlink(book.coverPath);
    }

    return {
        coverPath: bookCoverPath,
    }
}

export async function GET(request: NextRequest) {
    try {
        const sessionToken = request.cookies.get('session')?.value;
        if (!sessionToken) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = await decrypt(sessionToken);
        if (!session?.userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        await dbConnect();
        const booksByUser = await Book.find({
            userId: session?.userId as string
        });

        return NextResponse.json(booksByUser);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const _id = searchParams.get('_id');

        const sessionToken = (await cookies()).get('session')?.value;
        if (!sessionToken) {
            return new Response('Sessão invalida', {status: 401});
        }

        const session = await decrypt(sessionToken);
        if (!session?.userId) {
            return new Response('Sessão invalida', {status: 401});
        }

        await dbConnect();
        const booksByUser = await Book.findOneAndDelete({
            _id: _id,
            userId: session?.userId as string
        });

        if(booksByUser && booksByUser.coverPath){
            if (!existsSync(booksByUser.coverPath)) {
                return new Response('Imagem não encontrada', {status: 404});
            }
            await unlink(booksByUser.coverPath)   
        }

        return new Response(JSON.stringify({'message' : 'Deletado com sucesso'}), {
            status: 200,
            headers: {
                'Content-Type': `application/json`
            }
        });
    } catch (error) {
        console.log(error);
        return new Response('Erro Interno do Servidor', {status: 500});
    }
}