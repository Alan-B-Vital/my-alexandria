import { z } from 'zod'

export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Nomes devem conter mais de 2 caracteres.' })
        .trim(),
    email: z
        .string()
        .email({ message: 'Entre com um Email válido.' })
        .trim(),
    password: z
        .string()
        .min(8, { message: 'Ter 8 ou mais caracteres' })
        .regex(/[a-zA-Z]/, { message: 'Conter ao menos uma letra.' })
        .regex(/[0-9]/, { message: 'Conter ao menos um número.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Conter ao menos um caracter especial.',
        })
        .trim(),
    confirmPassword: z
        .string()
        .trim(),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "As senha não batem",
            path: ['confirmPassword']
        });
    }
});

export const SigninFormSchema = z.object({
    email: z
        .string()
        .email({ message: 'Entre com um Email válido.' })
        .trim(),
    password: z
        .string()
        .trim(),
});
 
export type FormState =
    | {
        errors?: {
            name?: string[]
            email?: string[]
            password?: string[]
            confirmPassword?: string[]
        },
        message?: string,
        dirty?: boolean
        }
    | undefined