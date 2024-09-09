import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prismadb } from "./prismadb";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prismadb),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jhon@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const existingUser = await prismadb.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!existingUser) {
                    throw new Error("No user found with this email");
                }

                const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password);
                if (!passwordMatch) {
                    throw new Error("Incorrect password");
                }

                return {
                    id: `${existingUser.id}`,
                    username: existingUser.username,
                    email: existingUser.email,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, }) {
            console.log(token, user)
            if (user) {
                return {
                    ...token,
                    username: user.username
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username
                }
            }
        },
    }
};
