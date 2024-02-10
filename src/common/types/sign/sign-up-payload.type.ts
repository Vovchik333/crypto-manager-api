import { SignInPayload } from "./sign-in-payload.type.js";

type SignUpPayload = {
    nickname: string;
} & SignInPayload;

export { type SignUpPayload };