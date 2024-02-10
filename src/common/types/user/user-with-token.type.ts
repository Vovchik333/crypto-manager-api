import { User } from "./user.type.js";

type UserWithToken = {
    user: User;
    accessToken: string;
};

export { type UserWithToken };