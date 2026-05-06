export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    // Required for extending built-in classes in TS
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string = 'Bad Request') {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}