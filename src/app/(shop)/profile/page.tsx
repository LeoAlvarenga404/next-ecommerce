import { serverUserService } from "@/services/server-user";
import { getSession } from "@/lib/auth";
import ProfileClient from "./client";
import { IUserData } from "@/@types/user";

export default async function ProfilePage() {
  const { session } = await getSession();

  const userData: IUserData | null = await serverUserService.getUserById(
    session?.user_id || ""
  );

  return <ProfileClient userData={userData} />;
}
