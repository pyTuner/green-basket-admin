export enum ROLES {
  USER = "USER",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

export interface IUser {
  name: string;
  email?: string;
  password?: string;
  primaryPhoneNumber: string;
  token: string;
  userId: string;
  secondaryPhoneNumber?: string;
  primaryAddress?: string;
  secondaryAddress?: string;
  role: string | ROLES.ADMIN;
}