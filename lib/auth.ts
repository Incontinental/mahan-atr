import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secretValue = process.env.AUTH_SECRET || (process.env.NODE_ENV === "production" ? "" : "development-secret-change-before-launch-000000");
if (process.env.NODE_ENV === "production" && secretValue.length < 32) throw new Error("AUTH_SECRET must be configured with at least 32 characters.");
const secret = new TextEncoder().encode(secretValue || "development-secret-change-before-launch-000000");
export async function createSession(user: { id: string; role: string; name: string }) {
  const token = await new SignJWT({ sub: user.id, role: user.role, name: user.name })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
  const jar = await cookies();
  jar.set("mahan_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession() {
  try {
    const jar = await cookies();
    const token = jar.get("mahan_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return { id: String(payload.sub), role: String(payload.role), name: String(payload.name || "") };
  } catch { return null; }
}
export async function requireAdmin() {
  const session = await getSession();
  if (!session || !["SUPER_ADMIN", "STORE_MANAGER", "ORDER_OPERATOR"].includes(session.role)) return null;
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || user.isBlocked) return null;
  return { ...session, phone: user.phone };
}
