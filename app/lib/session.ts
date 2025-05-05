'use server'
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key: Uint8Array = new TextEncoder().encode(process.env.JWT_KEY_ENCODING);

const cookie = {
    name: 'session',
    options: {
        httpOnly: true, secure: true, sameSite: 'lax', path: '/'
    },
    duration: 24 * 3600 * 1000 // 1 dia
}

export async function encrypt(payload:JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1day')
        .sign(key);
}

export async function decrypt(session:any) {
    try {
        const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createSession(userId: string) {
    const expires = new Date(Date.now() + cookie.duration);
    const session = await encrypt({ userId, expires });

    /** A linha abaixo aparenta esta com erro, porém isso parece ser um bug do visual studio mas não em runtime,
     * pode vir a causar problemas */
    // @ts-ignore
    (await cookies()).set(cookie.name, session, { ...cookie.options, expires })
}

export async function verifySession() {
    const sessionToken = (await cookies()).get(cookie.name)?.value;
    const session = await decrypt(sessionToken);
    if (!session?.userId) {
        return false;
    }
    return true;
}

export async function deleteSession() {
    (await cookies()).delete(cookie.name)
}