import { User } from "./user.type";

type UserWithToken = {
    user: User;
    accessToken: string;
};

export { type UserWithToken };