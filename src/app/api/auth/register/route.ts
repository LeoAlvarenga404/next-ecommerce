// api/auth/register/route.ts
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
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, senha e nome são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    const accesstoken = await createAccessToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await createRefreshToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        user_id: user.user_id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.cart.create({
      data: {
        user_id: user.user_id,
      },
    });

    await prisma.wishlist.create({
      data: {
        user_id: user.user_id,
      },
    });

    await setAuthCookies(accesstoken, refreshToken);

    return NextResponse.json(
      {
        message: "Usuário registrado com sucesso",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao registrar usuário: ${error}` },
      { status: 500 }
    );
  }
}
