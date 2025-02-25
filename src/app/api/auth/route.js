// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/utils/supabase"; // Import your Supabase client
import bcrypt from "bcryptjs"; // Import bcryptjs

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // If email or password are not provided, fail authentication
        }

        try {
          const { data: user, error } = await supabase
            .from("users") // Assuming your user table in Supabase is named "users"
            .select("*")
            .eq("email", credentials.email)
            .single();

          if (error) {
            console.error("Error fetching user from Supabase:", error);
            return null; // Handle Supabase query error
          }

          if (!user) {
            return null; // User not found in Supabase
          }

          // IMPORTANT: Use bcrypt to compare passwords securely
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            return null; // Passwords do not match
          }

          // If everything is successful, return the user object (adjust properties as needed)
          return {
            id: user.id.toString(), // Make sure id is a string as NextAuth expects
            email: user.email,
            name: user.full_name || user.email, // Use full_name if available, otherwise email as name
            // Add any other user properties you want to include in the session
          };
        } catch (error) {
          console.error("Error during authorize:", error);
          return null; // Handle any other errors during authentication
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt", // Recommended for production
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
