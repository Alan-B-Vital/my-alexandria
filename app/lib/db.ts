'use server'
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URL;

if (!MONGODB_URI) {
    throw new Error(
        'Por favor, defina a variável de ambiente MONGODB_URI no .env.local'
    );
}
const globalWithMongoose = global as typeof globalThis & {
    mongoose: {
        conn: any;
        promise: Promise<any> | null;
    };
};

let cached = globalWithMongoose.mongoose;
if (!cached) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}
async function dbConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        // @ts-ignore
        cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;