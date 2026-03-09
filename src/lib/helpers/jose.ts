import { jwtVerify } from "jose";

import type { JWTPayload } from "jose";

interface AuthPayload extends JWTPayload {
  sub: string;
  role: "admin" | "teacher" | "student" | "unregistered";
}

const secret = new TextEncoder().encode(process.env.ACCESS_SECRET);

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify<AuthPayload>(token, secret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}
