'use server';
import { randomUUID } from "crypto";
import mongoose from "mongoose";

const newSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        default: () => randomUUID()
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Evita o OverwriteModelError
const User = mongoose.models?.User || mongoose.model('User', newSchema);

export default User;