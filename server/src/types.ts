export type AuthResponse = {
  accessToken: string,
  refreshToken: string,
} | { message: string };