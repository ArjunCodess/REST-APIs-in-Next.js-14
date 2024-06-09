import connectToDB from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Blog from "@/lib/models/blog";

export const GET = async (request: Request, context: { params: any }) => {
     const blogId = context.params.blog;

     try {
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");
          const categoryId = searchParams.get("categoryId");

          if (!userId || !Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });

          if (!categoryId || !Types.ObjectId.isValid(categoryId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });

          if (!blogId || !Types.ObjectId.isValid(blogId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing blogId" }), { status: 400 });

          await connectToDB();

          const user = await User.findById(userId);

          if (!user) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });

          const category = await Category.findOne({ _id: categoryId, user: userId });

          if (!category) return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 400 });

          const blog = await Blog.findOne({ _id: blogId, user: userId, category: categoryId });

          if (!blog) return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 400 });

          return new NextResponse(JSON.stringify({ blog }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(dashboard)/blogs/[blog]/route.ts/PATCH : " + error.message, { status: 500 });
     }
}

export const PATCH = async (request: Request, context: { params: any }) => {
     const blogId = context.params.blog;

     try {
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");

          const body = await request.json();
          const { title, description } = body;

          if (!userId || !Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });

          if (!blogId || !Types.ObjectId.isValid(blogId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing blogId" }), { status: 400 });

          await connectToDB();

          const user = await User.findById(userId);

          if (!user) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });

          const blog = await Blog.findOne({ _id: blogId, user: userId });

          if (!blog) return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 400 });

          const updatedBlog = await Blog.findByIdAndUpdate(
               blogId,
               { title, description },
               { new: true },
          );

          return new NextResponse(JSON.stringify({ message: "Blog updated", blog: updatedBlog }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(dashboard)/blogs/[blog]/route.ts/PATCH : " + error.message, { status: 500 });
     }
}

export const DELETE = async (request: Request, context: { params: any }) => {
     const blogId = context.params.blog;

     try {
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");

          if (!userId || !Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });

          if (!blogId || !Types.ObjectId.isValid(blogId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });

          await connectToDB();

          const user = await User.findById(userId);

          if (!user) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });

          const blog = await Blog.findOne({ _id: blogId, user: userId });

          if (!blog) return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 400 });

          const deletedBlog = await Blog.findByIdAndDelete(blogId);

          return new NextResponse(JSON.stringify({ message: "Blog deleted", user: deletedBlog }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(dashboard)/blogs/[blog]/route.ts/DELETE : " + error.message, { status: 500 });
     }
}