export type ErrorResponse = {
  message: string
}

export type ClientAuthResponse = {
  accessToken: string,
} | ErrorResponse;

export type RefreshTokenBody = {
  refreshToken: string,
}

export type RefreshTokenResponse = {
  accessToken: string,
  refreshToken: string,
} | ErrorResponse