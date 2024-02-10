import { Request } from "express";

type JwtRequest = Request & {
    token: {
        id: string;
        email: string;
    };
};

export { type JwtRequest };
