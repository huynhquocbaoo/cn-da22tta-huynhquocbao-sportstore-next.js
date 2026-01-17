import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getConnection } from '@/lib/database';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email và mật khẩu là bắt buộc');
        }

        try {
          const pool = await getConnection();
          const conn = await pool.getConnection();

          try {
            const [users]: any = await conn.execute(
              'SELECT id, email, password, name, role, is_locked FROM users WHERE email = ?',
              [credentials.email]
            );

            if (users.length === 0) {
              throw new Error('Email hoặc mật khẩu không đúng');
            }

            const user = users[0];

            if (user.is_locked) {
              throw new Error('Tài khoản của bạn đã bị khóa');
            }

            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) {
              throw new Error('Email hoặc mật khẩu không đúng');
            }

            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role || 'user',
            };
          } finally {
            conn.release();
          }
        } catch (error: any) {
          throw new Error(error.message || 'Lỗi đăng nhập');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google sign in
      if (account?.provider === 'google') {
        try {
          const pool = await getConnection();
          const conn = await pool.getConnection();

          try {
            // Check if user exists
            const [existingUsers]: any = await conn.execute(
              'SELECT id, email, name, role, is_locked FROM users WHERE email = ?',
              [user.email]
            );

            if (existingUsers.length > 0) {
              const existingUser = existingUsers[0];
              
              // Check if account is locked
              if (existingUser.is_locked) {
                return '/login?error=AccountLocked';
              }

              // Update google_id if not set
              await conn.execute(
                'UPDATE users SET google_id = ? WHERE email = ?',
                [account.providerAccountId, user.email]
              );
            } else {
              // Create new user from Google account
              await conn.execute(
                'INSERT INTO users (email, name, password, role, google_id) VALUES (?, ?, ?, ?, ?)',
                [user.email, user.name, '', 'user', account.providerAccountId]
              );
            }

            return true;
          } finally {
            conn.release();
          }
        } catch (error) {
          console.error('Google sign in error:', error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';
      }

      // Get user role from database for Google users
      if (account?.provider === 'google' && token.email) {
        try {
          const pool = await getConnection();
          const conn = await pool.getConnection();

          try {
            const [users]: any = await conn.execute(
              'SELECT id, role FROM users WHERE email = ?',
              [token.email]
            );

            if (users.length > 0) {
              token.id = users[0].id.toString();
              token.role = users[0].role || 'user';
            }
          } finally {
            conn.release();
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

