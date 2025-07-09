import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, createAccessToken, setAuthCookies } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token não encontrado" },
        { status: 401 }
      );
    }

    await verifyToken(refreshToken);

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expires_at < new Date()) {
      return NextResponse.json(
        { error: "Refresh token inválido ou expirado" },
        { status: 401 }
      );
    }

    const newAccessToken = await createAccessToken({
      user_id: tokenRecord.user.user_id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
    });

    setAuthCookies(newAccessToken, "");

    return NextResponse.json({
      message: "Token renovado com sucesso",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao processar a requisição: ${error}` },
      { status: 500 }
    );
  }
}
