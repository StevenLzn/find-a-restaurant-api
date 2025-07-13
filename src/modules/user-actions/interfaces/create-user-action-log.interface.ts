import { ResponseStatus } from 'src/common/enums/response-status.enum';
import { UserActionType } from 'src/common/enums/user-action-type.enum';

export interface CreateUserActionLog {
  user_id?: string;
  action: UserActionType;
  resource: string;
  request_body?: string;
  request_params?: string;
  status: ResponseStatus;
}
