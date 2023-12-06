export interface CreateUser {
  mobile?: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date | string;
}
