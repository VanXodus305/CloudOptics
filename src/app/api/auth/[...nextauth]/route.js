import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "/src/lib/mongodb";
import { Member } from "/src/models/Member";

const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();

      try {
        let member = await Member.findOne({ email: user.email });

        if (!member) {
          // Create new member on first sign-in
          member = new Member({
            email: user.email,
            name: user.name,
            picture: user.image,
            role: "Viewer",
          });
          await member.save();
        } else {
          // Update picture if it changed
          if (user.image && user.image !== member.picture) {
            member.picture = user.image;
            await member.save();
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        token.picture = user.image;
      }

      if (account) {
        token.accessToken = account.access_token;
      }

      // Fetch user role from database
      try {
        await connectDB();
        const member = await Member.findOne({ email: token.email });
        if (member) {
          token.role = member.role;
          token.id = member._id.toString();
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

// Export named exports for HTTP methods
export const GET = handlers.GET;
export const POST = handlers.POST;
