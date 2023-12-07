import { Profile, Users } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ConvertorUtl } from '../../../../libs/common/src';

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
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  Profile?: Profile;

  constructor(partial: Partial<UserEntity>, omit?: Array<keyof UserEntity>) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, ConvertorUtl.JsonBigintString(partial));
  }

  @Expose({ name: 'Profile' })
  transformProfileUser() {
    if (!this.Profile) return undefined;
    return {
      firstName: this.Profile?.firstName,
      lastName: this.Profile?.lastName,
      birthday: this.Profile?.birthday,
      gender: this.Profile?.gender,
      avatar: this.Profile['Avatar']?.url,
    };
  }
}
