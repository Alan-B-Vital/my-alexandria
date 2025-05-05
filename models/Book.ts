'use server';
import { randomUUID } from "crypto";
import mongoose from "mongoose";

const newSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        default: () => randomUUID()
    },
    coverPath: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    rating: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        nullable: true
    },
    state: {
        type: String,
        enum: ['unread', 'reading', 'finished'],
        default: 'unread',
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    userId: {
        type: String,
        required: true
    }
});

// Evita o OverwriteModelError
const Book = mongoose.models?.Book || mongoose.model('Book', newSchema);

export default Book;