import { Schema, model } from "mongoose";
import { type User } from "@types";

const userSchema = new Schema<User>({
    nickname: {
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
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userModel = model<User>('user', userSchema, 'users');

export { userModel };