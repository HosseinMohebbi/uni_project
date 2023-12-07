export class GetTokensInterface {
  tokenExpireAtDay?: string;
  refreshTokenExpireAtDay?: string;
}

export interface ResponseGetTokensInterface {
  accessToken: string;
  refreshToken: string;
}
