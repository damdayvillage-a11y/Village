import 'next-auth';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      verified: boolean;
      image?: string;
      provider: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    verified: boolean;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    role: UserRole;
    verified: boolean;
    provider: string;
  }
}