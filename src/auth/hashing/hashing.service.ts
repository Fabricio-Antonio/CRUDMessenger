export abstract class HashingServiceProtocol {
  abstract hash(password: string): Promise<string>;
  abstract comparePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean>;
}
