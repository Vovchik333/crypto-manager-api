import { SignUpPayload } from "../sign/sign-up-payload.type";

type User = {
    id: string;
    updatedAt?: string;
    createdAt?: string;
} & SignUpPayload;

export { type User };
