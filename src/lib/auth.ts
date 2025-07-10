import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não está definida no ambiente.");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JWTPayload {
  user_id: string;
  email: string;
  role: string;
  exp: number;
}

export async function createAccessToken(payload: Omit<JWTPayload, "exp">) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS512" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function createRefreshToken(payload: Omit<JWTPayload, "exp">) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS512" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}  

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error("Token inválido ou expirado", { cause: error });
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return null;
  }
}

// Função para definir cookies diretamente no cookieStore
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  if (accessToken) {
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutos
      path: "/",
    });
  }

  if (refreshToken) {
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
