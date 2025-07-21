"use server";

import { getSession } from "@/lib/auth";
import { HeaderClient } from "./header-client";
export async function HeaderServer() {
  const session = await getSession();


  return <HeaderClient session={session} />;
}
