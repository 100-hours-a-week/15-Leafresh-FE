export enum HttpMethod {
  CREATE = 'CREATE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum HttpStatusCode {
  SUCCESS = 200,
  Created = 201,
  NoContent = 204,
  SeeOther = 303,
  BadRequest = 400,
  UnAuthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  Conflict = 409,
  IamAteapot = 418,
  InternalServerError = 500,
  NotImplemented,
}
