import { HttpCode } from "@lib/services/http";
import { ValueOf } from "@lib/types/generic";

const DEFAULT_MESSAGE = 'Internal server error.';

type Constructor = {
    status: ValueOf<typeof HttpCode>;
    message: string;
};

class HttpError extends Error {
    #status: ValueOf<typeof HttpCode>;

    constructor({ 
        status = HttpCode.INTERNAL_SERVER_ERROR, 
        message = DEFAULT_MESSAGE
    }: Constructor) {
        super(message);
        this.#status = status;
    }

    public get status() {
        return this.#status;
    }
}

export { HttpError };
