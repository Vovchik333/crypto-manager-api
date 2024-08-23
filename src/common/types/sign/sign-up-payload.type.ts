import { SignInPayload } from "./sign-in-payload.type";

type SignUpPayload = {
    nickname: string;
} & SignInPayload;

export { type SignUpPayload };