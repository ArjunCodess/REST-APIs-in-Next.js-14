import connectToDB from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const PATCH = async (request: Request, context: { params: any }) => {
     const categoryId = context.params.category;

     try {
          const body = await request.json();
          const { title } = body;
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");

          if (!userId || !Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });

          if (!categoryId || !Types.ObjectId.isValid(categoryId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });

          await connectToDB();

          const user = await User.findById(userId);

          if (!user) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });
          
          const category = await Category.findOne({ _id: categoryId, user: userId });

          if (!category) return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 400 });

          const updatedCategory = await Category.findByIdAndUpdate( categoryId, { title }, { new: true } );

          return new NextResponse(JSON.stringify(updatedCategory), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(dashboard)/categories/[category]/route.ts/PATCH : " + error.message, { status: 500 });
     }
}

export const DELETE = async (request: Request, context: { params: any }) => {
     const categoryId = context.params.category;

     try {
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");

          if (!userId || !Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });

          if (!categoryId || !Types.ObjectId.isValid(categoryId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });

          await connectToDB();

          const user = await User.findById(userId);

          if (!user) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });
          
          const category = await Category.findOne({ _id: categoryId, user: userId });

          if (!category) return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 400 });

          const deletedCategory = await Category.findByIdAndDelete( categoryId ); 

          return new NextResponse(JSON.stringify({ message: "Category deleted", user: deletedCategory }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(dashboard)/categories/[category]/route.ts/DELETE : " + error.message, { status: 500 });
     }
}