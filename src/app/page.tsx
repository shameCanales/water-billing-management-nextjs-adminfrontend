import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Index() {
  // check for your auth token
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
