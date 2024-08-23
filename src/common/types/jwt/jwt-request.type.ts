import { Request } from "express";

type JwtRequest = Request & {
    token: {
        id: string;
    };
};

export { type JwtRequest };
