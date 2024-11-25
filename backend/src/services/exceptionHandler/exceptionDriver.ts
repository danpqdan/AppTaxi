import { ExceptionConfigHandler } from './ExceptionConfig';

export class DriverNotFound extends ExceptionConfigHandler {
    constructor(resource: string) {
        super(
            'DRIVER_NOT_FOUND',
            `${resource}: Driver not found, please verify your chose and try again`,
            404
        )
    }
};

export class DriverNotFoundWithId extends ExceptionConfigHandler {
    constructor(resource: number) {
        super(
            'DRIVER_NOT_FOUND',
            `${resource} :This Driver_ID not found, please verify your chose and try again`,
            404
        )
    }
};

export class DistanceInvalid extends ExceptionConfigHandler {
    constructor() {
        super(
            "INVALID_DISTANCE",
            "Km is invalid for this driver",
            406,
        )
    }
}

export class InvalidDriver extends ExceptionConfigHandler {
    constructor() {
        super(
            "INVALID_DRIVER",
            "Driver invalid",
            400
        )
    }
}

