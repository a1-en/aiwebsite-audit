import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password, confirmPassword } = await req.json();

        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        await dbConnect();

        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({
            message: "User registered successfully",
            id: user._id,
        }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
