import { Users } from '@prisma/client';

export class UserEntity implements Users {
  id: number;
  uid: string;
  email: string;
  mobile: string | null;
  password: string;
  emailVerifiedAt: Date | null;
  mobileVerifiedAt: Date | null;
  lastLogin: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>, omit?: Array<keyof UserEntity>) {
    omit?.forEach((property) => {
      delete this[property];
    });
  }
}
