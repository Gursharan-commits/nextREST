import { NextResponse } from 'next/server';
import User from "@/lib/models/user"
import connect from "@/lib/db";
import { Types } from 'mongoose';
import Category from "@/lib/models/category";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "ID not found or invalid" }), { status: 400 });
        }
        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });

        }

        const categories = await Category.find(
            { user: new Types.ObjectId(userId) }
        );

        if (!categories) {
            return new NextResponse(JSON.stringify({ message: "No categories found" }), { status: 400 });
        }

        return new NextResponse(JSON.stringify(categories), { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}