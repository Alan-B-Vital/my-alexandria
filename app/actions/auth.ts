'use server'
import { SignupFormSchema, SigninFormSchema, FormState } from '@/app/lib/definitions';
import bcrypt from "bcryptjs";
import dbConnect from '../lib/db';
import User from '@/models/User';
import { createSession, verifySession, deleteSession } from '@/app/lib/session';

export async function signup(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });
 
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            values: { 
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
            }
        }
    }
 
    const { name, email, password } = validatedFields.data;
    await dbConnect();
    const userAlreadyExists = await User.findOne({
        email: email,
    });

    if (userAlreadyExists){
        return {
            message: 'Email already in use.',
            values: { 
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
            }
        }
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
    });
 
    if (!userData) {
        return {
            message: 'An error occurred while creating your account.',
            values: { 
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
            }
        }
    }

    await createSession(userData._id.toString());

    return {
        dirty: !(state?.dirty ?? true) // hack para verificar sessão onReturn
    }
}

export async function signin(state: FormState, formData: FormData) {
    const validatedFields = SigninFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            values: { email: formData.get('email') }
        }
    }

    const { email, password } = validatedFields.data
    await dbConnect();
    const userData = await User.findOne({
        email: email,
    });
    
    if (!userData || (userData && (await bcrypt.compare(password, userData.password) !== true))) {
        return {
            message: 'Incorrect credentials',
            values: { email: formData.get('email') }
        }
    }

    await createSession(userData._id.toString());

    return {
        dirty: !(state?.dirty ?? true) // hack para verificar sessão onReturn
    }
}

export async function logout() {
    if(await verifySession){
        await deleteSession();
    }
}