import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      name: true,
      email: true,
      phone: true,
      UserAddress: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
) {
  const data = await req.json();

  const updatedUser = await prisma.user.update({
    where: { user_id: data.user_id},
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
  });

  return NextResponse.json(updatedUser);
}
