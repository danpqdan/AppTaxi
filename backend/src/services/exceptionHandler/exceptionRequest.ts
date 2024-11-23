import { ExceptionConfigHandler } from './ExceptionConfig';

export class ErrorInvalidRequest extends ExceptionConfigHandler {
    constructor() {
        super(
            "INVALID_DATA",
            "The data provided does not request body are invalid",
            400
        )
    }
}

export class SuccessResponse {
    message: string;
    statusCode: number;
    constructor(message = "SUCESS_REQUEST", statusCode = 200) {
        this.message = message;
        this.statusCode = statusCode
    }
}

export class ErrorInter extends ExceptionConfigHandler {
    constructor() {
        super(
            "SERVER_IS_FAILED",
            "Pless reload your app, if this persist contact us",
            500
        )
    }
}