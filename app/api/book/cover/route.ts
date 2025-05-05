'use server'
import { decrypt } from "@/app/lib/session";
import { NextRequest } from "next/server";
import path from "path";
import fs from 'fs';
import Book from "@/models/Book";
import dbConnect from "@/app/lib/db";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
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
        const booksByUser = await Book.findOne({
            _id: _id,
            userId: session?.userId as string
        }).select('coverPath');

        if (!fs.existsSync(booksByUser.coverPath)) {
            return new Response('Imagem não encontrada', {status: 404});
        }

        const fileBuffer = fs.readFileSync(booksByUser.coverPath);

        return new Response(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': `image/${path.extname(booksByUser.coverPath)}`,
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.log(error);
        return new Response('Erro Interno do Servidor', {status: 500});
    }
}

