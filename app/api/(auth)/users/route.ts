import { NextResponse } from 'next/server';
import User from "@/lib/models/user"
import connect from "@/lib/db";
import { Types } from 'mongoose';
import { request } from 'http';

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in fetching users" + error.message, { status: 500, });
    }
};

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(JSON.stringify({ message: "user is created", user: newUser }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in creating user" + error.message, { status: 500, });
    };
};
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()
        const { userId, newUsername } = body;

        await connect();
        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({ message: "ID or new Username not found" }),
                { status: 400 }
            );
        };

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "invalid user ID" }), { status: 400 }
            );
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true } //setting true returns the new user and not the old one
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "user not found in the database" }), { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is updated", user: updatedUser }), { status: 200 }
        );
    } catch (error: any) {

        return new NextResponse("Error in updating user" + error.message, { status: 500 })
    };

};

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        await connect();
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "User ID not found" }),
                { status: 400 }
            );
        };

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID" }), { status: 400 }
            );
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }), { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is deleted", user: deletedUser }), { status: 200 }
        );
    } catch (error) {
        return new NextResponse("Invalid user ID", { status: 400 })
    }
};