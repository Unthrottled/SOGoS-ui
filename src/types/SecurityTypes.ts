export type ReceivedReadToken = {
  readToken: string,
  userIdentifier: string
};

export interface TokenInformation {
  expiresAt: number; //epoch second
  issuedAt: number; //epoch second
}

export class SessionExpiredException extends Error {}
