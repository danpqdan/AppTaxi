import { ExceptionConfigHandler } from './ExceptionConfig';
export class RiderNotFound extends ExceptionConfigHandler {
    constructor() {
        super(
            "NO_RIDES_FOUND",
            "No register found",
            404
        )
    }
}