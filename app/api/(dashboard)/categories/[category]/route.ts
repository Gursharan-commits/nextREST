//[sq brackets for the dynamic urls]
//categoryID is passed as parameter in url, but not as JSON object with key?value format of url

// ex- http://localhost:3000/api/categories/1231234123er?userId=66900b9624387af62e57e6f6 
//everything with ? is accessed by seachParams
//if not ?- context/params for kurl

import connect from "@/lib/db";
import User from "@/lib/models/user"
import Category from "@/lib/models/category";
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

export const PATCH = async (request: Request, context: { params: any }) => {

    //since, categoryId id passed in the URL (to have dynamic url. the value of it is passed as context params)
    const categoryId = context.params.category;
    try {
        // get totle from there request body
        const body = await request.json();
        const { title } = body;

        //userid is passed in url- access them as did in Delete function of the users routes
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        //validate userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing user ID" }),
                { status: 400 }
            );
        }

        //validate categoryId
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing category ID" }), { status: 400 }
            );
        }

        //connect to db 
        await connect();

        //find the user by userId received in url as JSON
        const user = await User.findById(userId);

        //validate- id user exist
        //_id- underscore because id of existing model in mongo starts with _
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 }
            );
        };

        //find category id and validate
        const category = await Category.findOne({ _id: categoryId, user: userId });
        if (!category) {
            return new NextResponse(
                JSON.stringify({ Message: "Category not found" }), { status: 404 }
            );
        }

        //udate category ID
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true }
        );

        return new NextResponse(
            JSON.stringify(
                {
                    message: "Category updated",
                    category: updatedCategory,
                }),
            { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("Error in updating category" + error.message, { status: 500 });
    };

};

export const DELETE = async (request: Request, context: { params: any }) => {
    const categoryId = context.params.category;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "invalid or missing UserId" }), { status: 400 }
            );
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid or missing categoryId"
                }),
                { status: 400 }
            );
        }

        await connect();
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found"
                }),
                { status: 404 })
        }
        const category = await Category.findOne({ _id: categoryId, user: userId })

        if (!category) {
            return new NextResponse(
                JSON.stringify({
                    message: "Category Not Found"
                }),
                { status: 404 }
            );
        }

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        return new NextResponse(
            JSON.stringify({ message: "Category deleted", category: deletedCategory }), { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("error in deleting category" + error.message, { status: 500 }
        );
    }

}