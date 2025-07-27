import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const userAddressSchema = z.object({
  street: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zip_code: z.string().min(5).max(10),
});

export async function GET(request: NextRequest) {
  try {
    const { session } = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const addresses = await prisma.userAddress.findMany({
      where: { user_id: session.user_id },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao buscar endereços: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session } = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsedBody = userAddressSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { street, city, state, zip_code } = parsedBody.data;

    const existingAddress = await prisma.userAddress.findFirst({
      where: { street, city, state, zip_code, user_id: session.user_id },
    });

    if (existingAddress) {
      return NextResponse.json(
        { error: "Endereço já existe" },
        { status: 409 }
      );
    }

    const address = await prisma.userAddress.create({
      data: {
        user_id: session.user_id,
        street,
        city,
        state,
        zip_code,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error: any) {
    console.error("Error in address route:", error);
    return NextResponse.json(
      { error: `Erro ao processar solicitação: ${error.message}` },
      { status: 500 }
    );
  }
}
