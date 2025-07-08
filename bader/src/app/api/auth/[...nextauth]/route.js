
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Notification from "@/models/Notification"; // ⬅️ لإرسال إشعار ترحيبي

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("البريد غير مسجل");
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("كلمة المرور غير صحيحة");

        return user;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.image = token.image || session.user.image;
        session.user.phone = token.phone || "";
      }
      return session;
    },
    async jwt({ token, user, account }) {
      await connectDB();
      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: token.email });
        if (!existingUser) {
          // إنشاء مستخدم جديد لحساب Google
          existingUser = await User.create({
            name: token.name,
            email: token.email,
            image: token.picture,
            IsConfirmed: true,
          });

          // إرسال إشعار ترحيبي
          await Notification.create({
            title: "مرحبًا بك في بادر!",
            message: "يسعدنا انضمامك معنا كمستخدم جديد ❤️",
            type: "welcome",
            user: existingUser._id,
          });
        }
        token.phone = existingUser.phone || "";
      }

      if (user) {
        token.email = user.email;
        token.image = user.image;
        token.phone = user.phone || "";
      }
      return token;
    },
  },

  pages: {
    signIn: "/",
    error: "/login?error=OAuth",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
