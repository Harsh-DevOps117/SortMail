import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Ask for email, profile, and Gmail modification rights
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.modify",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        
        // Find or create user in our MongoDB Atlas
        let existingUser = await User.findOne({ googleId: user.id });
        
        if (!existingUser) {
          existingUser = new User({
            googleId: user.id,
            email: user.email,
            name: user.name,
          });
        }
        
        // Save the access and refresh tokens so our backend can read their Gmail
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
})

export { handler as GET, handler as POST }
