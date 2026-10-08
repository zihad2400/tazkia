import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions = {
  providers: [
    // ═══ Google OAuth ═══
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    // ═══ Credentials (Email + Password) ═══
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('ইমেইল এবং পাসওয়ার্ড দিন');
        }

        await dbConnect();

        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select('+password');

        if (!user) throw new Error('এই ইমেইলে কোনো একাউন্ট নেই');
        if (!user.password) throw new Error('Google দিয়ে সাইন ইন করুন');

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) throw new Error('পাসওয়ার্ড ভুল');
        if (user.status === 'suspended') throw new Error('একাউন্ট সাসপেন্ডেড');

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
          role: user.role || 'user',
        };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    // Google user-কে DB-তে save/update
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const existing = await User.findOne({
            email: user.email.toLowerCase(),
          });

          if (existing) {
            await User.findByIdAndUpdate(existing._id, {
              image: user.image || existing.image,
              emailVerified: existing.emailVerified || new Date(),
              lastActive: new Date(),
            });
            user.id = existing._id.toString();
            user.role = existing.role || 'user';
          } else {
            const newUser = await User.create({
              name: user.name || 'User',
              email: user.email.toLowerCase(),
              image: user.image || '',
              provider: 'google',
              emailVerified: new Date(),
              role: 'user',
              status: 'active',
            });
            user.id = newUser._id.toString();
            user.role = 'user';
          }
        } catch (err) {
          console.error('🔴 Google signIn error:', err);
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        token.picture = user.image || null;
      }
      if (account?.provider === 'google' && user?.email) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email.toLowerCase() });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role || 'user';
            token.picture = dbUser.image || user.image || null;
          }
        } catch (e) {}
      }
      if (trigger === 'update' && session) {
        if (session.image !== undefined) token.picture = session.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
