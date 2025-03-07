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
          console.error("Missing email or password");
          return null;
        }

        try {
          console.log("Fetching user from Supabase for email:", credentials.email);
          const { data: user, error } = await supabase
            .from("users")
            .select("user_id, email, password, full_name, username")
            .eq("email", credentials.email)
            .single();

          if (error) {
            console.error("Error fetching user from Supabase:", error);
            return null;
          }

          if (!user) {
            console.error("User not found");
            return null;
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            console.error("Password mismatch");
            return null;
          }

          console.log("User authenticated successfully:", user.username);

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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
