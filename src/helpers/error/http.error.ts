import { HttpCode, ErrorMessage } from "@enums";
import { ValueOf } from "@generic";

type Constructor = {
    status: ValueOf<typeof HttpCode>;
    message: string;
};

class HttpError extends Error {
    #status: ValueOf<typeof HttpCode>;

    constructor({ 
        status = HttpCode.INTERNAL_SERVER_ERROR, 
        message = ErrorMessage.INTERNAL_SERVER_ERROR
    }: Constructor) {
        super(message);
        this.#status = status;
    }

    public get status() {
        return this.#status;
    }
}

export { HttpError };
