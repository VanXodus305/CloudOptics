import { auth } from "../app/api/auth/[...nextauth]/route";

export async function verifySession(request) {
  // Check for test bypass header
  const bypassHeader = request.headers.get("x-bypass-auth");
  if (bypassHeader && bypassHeader === process.env.TEST_BYPASS_SECRET) {
    return {
      user: {
        email: "soumyadeep.kundu@gmail.com",
        name: "Soumyadeep Kundu",
        role: "Admin"
      }
    };
  }

  // Fall back to NextAuth authentication
  const session = await auth();
  return session;
}
