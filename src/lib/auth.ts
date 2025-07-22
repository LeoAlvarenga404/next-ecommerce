import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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
    .setExpirationTime("30m")
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

// ✅ Versão que NÃO modifica cookies - compatível com o código atual
export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return { session: null };
  }

  try {
    const payload = await verifyToken(accessToken || "");
    return { session: payload };
  } catch (error) {
    if (!refreshToken) {
      return { session: null };
    }

    try {
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord || tokenRecord.expires_at < new Date()) {
        // ❌ NÃO chama clearAuthCookies() aqui
        return { session: null, needsCookieCleanup: true };
      }

      await verifyToken(refreshToken);

      // ❌ NÃO faz operações de banco nem cria tokens aqui
      // Apenas indica que precisa renovar
      return {
        session: {
          user_id: tokenRecord.user.user_id,
          email: tokenRecord.user.email,
          role: tokenRecord.user.role,
        },
        needsRefresh: true,
        refreshData: {
          user_id: tokenRecord.user.user_id,
          email: tokenRecord.user.email,
          role: tokenRecord.user.role,
          oldRefreshToken: refreshToken,
        },
      };
    } catch (refreshError) {
      return { session: null, needsCookieCleanup: true };
    }
  }
}

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
      maxAge: 30 * 60,
      path: "/",
    });
  }

  if (refreshToken && refreshToken.trim() !== "") {
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

// ✅ Versão que não modifica cookies - apenas para verificação
export async function getSessionReadOnly() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return { session: null };
  }

  try {
    const payload = await verifyToken(accessToken || "");
    return { session: payload };
  } catch (error) {
    if (!refreshToken) {
      return { session: null, expired: true };
    }

    try {
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord || tokenRecord.expires_at < new Date()) {
        return { session: null, expired: true };
      }

      await verifyToken(refreshToken);

      // Retorna informações para renovação, mas não modifica nada
      return {
        session: {
          user_id: tokenRecord.user.user_id,
          email: tokenRecord.user.email,
          role: tokenRecord.user.role,
        },
        needsRefresh: true,
        refreshData: {
          user_id: tokenRecord.user.user_id,
          email: tokenRecord.user.email,
          role: tokenRecord.user.role,
          oldRefreshToken: refreshToken,
        },
      };
    } catch (refreshError) {
      return { session: null, expired: true };
    }
  }
}
