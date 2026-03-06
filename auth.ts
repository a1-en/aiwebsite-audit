import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { authConfig } from "./auth.config";

class UserNotFoundError extends CredentialsSignin {
    code = "UserNotExist";
}

class InvalidPasswordError extends CredentialsSignin {
    code = "InvalidCredentials";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    await dbConnect();

                    const user = await User.findOne({ email: credentials.email }).select("+password");

                    if (!user || !user.password) {
                        throw new UserNotFoundError();
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!isValid) {
                        throw new InvalidPasswordError();
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Auth Error:", error);

                    if (error instanceof CredentialsSignin) {
                        throw error;
                    }

                    return null;
                }
            },
        }),
    ],
});
