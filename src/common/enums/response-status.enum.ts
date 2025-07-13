export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  VALIDATION_ERROR = 'validation_error',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  BAD_REQUEST = 'bad_request',
  INTERNAL_SERVER_ERROR = 'internal_server_error',
  EXTERNAL_SERVICE_ERROR = 'external_service_error',
}
