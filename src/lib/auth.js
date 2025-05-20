import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // تحقق بسيط (للتجربة فقط)
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          return { id: '1', name: 'Admin' };
        }
        // يمكنك ربطها بقاعدة بياناتك هنا
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
}; 