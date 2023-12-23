export interface CreateUser {
  email: string;
  password: string;
  nickName?: string;
  isActive?: boolean;
  lastLogin?: Date;
}
