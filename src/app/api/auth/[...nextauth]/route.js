import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data: user, error } = await supabase
            .from("users")
            .select("user_id, email, password, full_name, username") // ✅ Fixed ID field
            .eq("email", credentials.email)
            .single();

          if (error) {
            console.error("Error fetching user from Supabase:", error);
            return null;
          }

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.user_id.toString(),
            email: user.email,
            name: user.full_name || user.email,
            username: user.username,
          };
        } catch (error) {
          console.error("Error during authorize:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};

// ✅ Correct export format for Next.js App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
