import { NextResponse} from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { clearAuthCookies
 } from '@/lib/auth'; 

export async function POST() {
  try {
   const cookieStore = cookies();
   const refreshToken = (await cookieStore).get('refreshToken')?.value;

   if(refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    })
   }

   clearAuthCookies();

   return NextResponse.json({ message: 'Logout realizado com sucesso.' }, { status: 200 });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}