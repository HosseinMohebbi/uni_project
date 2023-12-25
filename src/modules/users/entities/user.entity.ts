import { Profile, RoleEnum, Users } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserEntity implements Users {
  id: number;
  uid: string;
  email: string;
  mobile: string | null;
  @Exclude()
  password: string;
  emailVerifiedAt: Date | null;
  mobileVerifiedAt: Date | null;
  lastLogin: Date | null;
  isActive: boolean;
  role: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
  @Exclude()
  Profile?: Profile;

  constructor(partial: Partial<UserEntity>, omit?: Array<keyof UserEntity>) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, partial);
  }

  @Expose({ name: 'Profile' })
  transformProfileUser() {
    if (!this.Profile) return undefined;
    return {
      nickName: this.Profile.nickName,
    };
  }
}
