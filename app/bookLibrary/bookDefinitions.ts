import { z } from 'zod'


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const CreateBookSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Nomes devem conter mais de 2 caracteres.' })
        .trim(),
    description: z
        .string()
        .max(255, { message: 'Descrição muito longa.' })
        .trim()
        .optional(),
    rating: z
        .number()
        .min(0, { message: 'Valores inferiores a zero não suportados' })
        .max(10, { message: 'valores superiores a dez não suportados' }),
    coverPath: z
        .string()
        .trim()
        .optional(),
    state: z
        .enum(['unread', 'reading', 'finished'])
        .default('unread')
        .optional(),
});

export const BookCoverSchema = z.object({
    _id: z.string().trim(),
    bookCover: z.any()
      .refine((bookCover) => bookCover instanceof File, { message: 'File is required' })
      .refine((bookCover) => bookCover.size <= MAX_FILE_SIZE, { message: 'Tamanho Maximo de arquivo: 5MB' })
      .refine((bookCover) => ACCEPTED_FILE_TYPES.includes(bookCover.type), { message: 'Only .jpg, .jpeg, .png and .webp formats are supported' })
});


export type BookCoverFormState =
    | {
        errors?: {
            bookCover?: string[]
        },
        message?: string,
        dirty?: boolean
        }
    | undefined

export interface BookDataProps {
    _id: String,
    coverPath: String,
    name: String,
    description: String,
    rating: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    state: ['unread', 'reading', 'finished'],
    createdAt: Date,
    userId: String
}
 
export type FormState =
    | {
        errors?: {
            name?: string[]
            description?: string[]
            rating?: string[]
            coverPath?: string[]
            state?: string[]
        },
        message?: string,
        dirty?: boolean
        }
    | undefined