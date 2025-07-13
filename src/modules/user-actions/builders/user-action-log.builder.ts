import { UserActionType } from 'src/common/enums/user-action-type.enum';
import { ResponseStatus } from 'src/common/enums/response-status.enum';

// Builder para crear logs de acciones de usuario
// Este builder permite construir un objeto de log con los detalles de la acción del usuario,
export class UserActionLogBuilder {
  private userId: string | null = null;
  private action: UserActionType;
  private resource: string;
  private requestBody?: string;
  private requestParams?: string;
  private status: ResponseStatus;

  constructor(action: UserActionType, resource: string) {
    this.action = action;
    this.resource = resource;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
    return this;
  }

  setRequestBody(body?: any) {
    this.requestBody = body ? JSON.stringify(body) : undefined;
    return this;
  }

  setRequestParams(params?: any) {
    this.requestParams = params ? JSON.stringify(params) : undefined;
    return this;
  }

  setStatus(status: ResponseStatus) {
    this.status = status;
    return this;
  }

  build() {
    return {
      userId: this.userId,
      action: this.action,
      resource: this.resource,
      request_body: this.requestBody,
      request_params: this.requestParams,
      status: this.status,
    };
  }
}
