async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    console.error("❌ Missing email or password");
    return null;
  }

  try {
    // ✅ Fetch user including username
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password, full_name, username") // Include username
      .eq("email", credentials.email)
      .single();

    if (error) {
      console.error("❌ Supabase fetch error:", error.message);
      return null;
    }

    if (!user) {
      console.error("❌ User not found");
      return null;
    }

    // ✅ Compare hashed password
    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    if (!passwordMatch) {
      console.error("❌ Invalid password");
      return null;
    }

    console.log("✅ User authenticated:", user.email);

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.full_name || user.username || user.email, // ✅ Use username if available
      username: user.username, // ✅ Store username in session
    };
  } catch (error) {
    console.error("❌ Error during authentication:", error);
    return null;
  }
}
