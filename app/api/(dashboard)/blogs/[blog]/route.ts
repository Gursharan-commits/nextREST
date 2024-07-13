import { NextResponse } from 'next/server';
import connect from "@/lib/db";
import Blog from "@/lib/models/blog";
import { Types } from 'mongoose';
import User from "@/lib/models/user"
import Category from "@/lib/models/category";
import { BloomFilter } from 'next/dist/shared/lib/bloom-filter';

export const GET = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse(JSON.stringify({ message: "missing categoryId" }), { status: 400 });
        }

        if (!Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "invalid categoryId" }), { status: 400 });
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing blogID" }), { status: 400 });
        }
        await connect();

        const user = await User.findById(userId);
        const category = await Category.findById(categoryId);


        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not Found" }), { status: 404 });
        }
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "category not found" }), { status: 404 });
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId,
        });

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ blog }), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error finding the blog" + error.message, { status: 500 });
    }
}


export const PATCH = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;
    try {
        const body = await request.json();
        const { title, description } = body;;

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "ID not found or invalid" }), { status: 400 });
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "ID not found or invalid" }), { status: 400 });
        }

        await connect();
        const user = await User.findById(userId);

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not Found" }), { status: 404 });
        }

        const blog = await Blog.findOne({ _id: blogId, user: userId })
        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "blog not Found" }), { status: 404 });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        );

        return new NextResponse(JSON.stringify({ message: "Blog updated", blog: updatedBlog }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("error posting blog" + error.message, { status: 500 });
    }
}