import { SignUpPayload } from "../sign/sign-up-payload.type";

type User = {
    id: string;
    updatedAt?: Date;
    createdAt?: Date;
} & SignUpPayload;

export { type User };
