import jwt, { SignOptions, Secret } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "default_secret_key";

interface TokenPayload {
  id: string;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: TokenPayload, expiresIn: string = "1d") {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, SECRET, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    return decoded;
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
}
