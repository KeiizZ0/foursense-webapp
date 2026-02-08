export type RegularRes = {
  success: boolean;
  message: string;
};

export type AuthRes = {
  success: boolean;
  message: string;
  data: TokenData;
};

export type TokenData = {
  accessToken: string;
  refreshToken: string;
};

export type LoginReq = {
  email: string;
  password: string;
};
