export class TokenPayloadDto {
  sub: string;
  email: string;
  iat: number; // issued at
  exp: number; // expiration time
  aud: string; // audience
  iss: string; // issuer
}
