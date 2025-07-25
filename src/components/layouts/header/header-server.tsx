import { getSessionReadOnly } from "@/lib/auth";
import { HeaderClient } from "./header-client";

export async function HeaderServer() {
  const sessionData = await getSessionReadOnly();
  
  return <HeaderClient initialSession={sessionData} />;
}