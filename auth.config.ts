import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        newUser: "/register",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

            // Protected paths
            const isProtected = nextUrl.pathname.startsWith("/dashboard") ||
                nextUrl.pathname.startsWith("/report") ||
                nextUrl.pathname.startsWith("/scanner");

            if (isProtected && !isLoggedIn) {
                return false; // Redirect to login
            }

            if (isAuthPage && isLoggedIn) {
                return Response.redirect(new URL("/scanner", nextUrl));
            }

            return true;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
