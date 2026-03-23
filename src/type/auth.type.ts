export type RegularRes = {
  success: boolean;
  message: string;
};

export type AuthRes = {
  success: boolean;
  message: string;
  data: BasicToken;
};

export type BasicToken = {
  accessToken: string;
  refreshToken: string;
};

export type AuthReq = {
  email: string;
  password: string;
};

export type ChangePasswordRes = {
  success: boolean;
  message: string;
  data: ResetToken;
};

export type ResetToken = {
  resetToken: string;
};

export type ChangePasswordReq = {
  oldPassword: string
};
