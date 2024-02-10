import { SignUpPayload } from "../sign/sign-up-payload.type.js";

type User = {
    _id: string;
    updatedAt?: Date;
    createdAt?: Date;
} & SignUpPayload;

export { type User };
