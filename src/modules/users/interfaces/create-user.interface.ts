export interface CreateUser {
  email: string;
  password: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date | string;
}
