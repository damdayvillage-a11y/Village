import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '../db';
import { verifyPassword } from './password';
import { UserRole } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    // OAuth Providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Email Provider for passwordless login
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        // Custom email verification logic will be implemented here
        console.log(`Sending verification email to ${email}: ${url}`);
      },
    }),
    
    // Credentials Provider for email/password login
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }

          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error('Invalid credentials');
          }

          if (!user.verified) {
            throw new Error('Please verify your email before logging in');
          }

          if (!user.active) {
            throw new Error('Account has been deactivated');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            verified: user.verified,
          };
        } catch (error) {
          // If it's a validation error we threw, rethrow it
          if (error instanceof Error && (
            error.message === 'Invalid credentials' ||
            error.message === 'Please verify your email before logging in' ||
            error.message === 'Account has been deactivated'
          )) {
            throw error;
          }
          // For database connection errors, provide a more helpful message
          console.error('Database error during authentication:', error);
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          if (errorMsg.includes('connect') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('timeout')) {
            throw new Error('Database connection failed. Please contact support.');
          }
          throw new Error('Unable to authenticate. Please try again later.');
        }
      },
    }),
    
    // DID/Web3 Provider (placeholder for future Web3 integration)
    CredentialsProvider({
      id: 'web3',
      name: 'Web3 Wallet',
      credentials: {
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        address: { label: 'Address', type: 'text' },
      },
      async authorize(credentials) {
        // Web3 signature verification will be implemented here
        // For now, this is a placeholder for DID/SSI integration
        if (!credentials?.address || !credentials?.signature) {
          return null;
        }
        
        // TODO: Implement Web3 signature verification
        // const isValidSignature = await verifyWeb3Signature(...)
        
        return null; // Disabled until Web3 integration is complete
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in for verified users or OAuth providers
      if (account?.provider !== 'credentials') {
        return true;
      }
      
      return user.verified === true;
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign in
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
    
    async jwt({ token, user, account }) {
      // Add custom fields to JWT token
      if (user) {
        token.role = user.role;
        token.verified = user.verified;
        token.userId = user.id;
      }
      
      // Handle OAuth account linking
      if (account) {
        token.provider = account.provider;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user.id = token.userId as string;
        session.user.role = token.role as UserRole;
        session.user.verified = token.verified as boolean;
        session.user.provider = token.provider as string;
      }
      
      // Update last login timestamp (non-blocking, fails gracefully)
      if (session.user?.id) {
        try {
          await db.user.update({
            where: { id: session.user.id },
            data: { lastLogin: new Date() },
          });
        } catch (error) {
          // Log but don't fail the session if database update fails
          console.warn('Failed to update last login timestamp:', error);
        }
      }
      
      return session;
    },
  },
  
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`);
      
      if (isNewUser) {
        try {
          // Set default role for new users
          await db.user.update({
            where: { id: user.id },
            data: { 
              role: UserRole.GUEST,
              verified: account?.provider !== 'credentials', // Auto-verify OAuth users
            },
          });
        } catch (error) {
          // Log but don't fail the sign in if database update fails
          console.warn('Failed to update new user role:', error);
        }
      }
    },
    
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
    
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
};