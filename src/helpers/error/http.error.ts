import { HttpCode } from "../../common/enums/http/http-code.enum.js";
import { ValueOf } from "../../common/types/value-of/value-of.type.js";

const DEFAULT_MESSAGE = 'Internal Server Error.';

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

export default HttpError;