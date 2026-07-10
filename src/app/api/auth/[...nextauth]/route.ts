import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        await connectToDatabase();
        
        let existingUser = await User.findOne({ googleId: user.id });
        
        if (!existingUser) {
          existingUser = new User({
            googleId: user.id,
            email: user.email,
            name: user.name,
          });
        }
        
        existingUser.accessToken = account.access_token || existingUser.accessToken;
        if (account.refresh_token) {
          existingUser.refreshToken = account.refresh_token;
        }
        
        await existingUser.save();
        return true;
      }
      return false;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
