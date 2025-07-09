import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const accessToken = await createAccessToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await createRefreshToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.deleteMany({
      where: { user_id: user.user_id },
    });

    await prisma.refreshToken.create({
      data: {
        user_id: user.user_id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
