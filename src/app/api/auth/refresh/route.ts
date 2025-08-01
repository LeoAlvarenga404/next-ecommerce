import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyToken,
  createAccessToken,
  setAuthCookies,
  clearAuthCookies,
  createRefreshToken,
} from "@/lib/auth";
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

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Refresh token não encontrado no banco de dados" },
        { status: 401 }
      );
    }

    if (tokenRecord.expires_at < new Date()) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      await clearAuthCookies();

      return NextResponse.json(
        { error: "Refresh token expirado" },
        { status: 401 }
      );
    }

    try {
      await verifyToken(refreshToken);
    } catch (jwtError) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
      await clearAuthCookies();

      return NextResponse.json(
        { error: "Refresh token inválido" },
        { status: 401 }
      );
    }

    const newAccessToken = await createAccessToken({
      user_id: tokenRecord.user.user_id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
    });

    const newRefreshToken = await createRefreshToken({
      user_id: tokenRecord.user.user_id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
    });

    await prisma.refreshToken.deleteMany({
      where: { user_id: tokenRecord.user.user_id },
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        user_id: tokenRecord.user.user_id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({
      message: "Token renovado com sucesso",
    });
  } catch (error) {
    console.error("Erro na rota de refresh:", error);
    await clearAuthCookies();
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
