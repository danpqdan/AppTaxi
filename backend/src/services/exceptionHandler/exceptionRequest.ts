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
    sucess_request: boolean;
    constructor(sucess_request = true) {
        this.sucess_request = sucess_request;
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