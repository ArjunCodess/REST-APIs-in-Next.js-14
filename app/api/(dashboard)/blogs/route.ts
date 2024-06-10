import connectToDB from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
     try {
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");
          const categoryId = searchParams.get("categoryId");
          const searchKeywords = searchParams.get("keywords") as string;
          const startDate = searchParams.get("startDate");
          const endDate = searchParams.get("endDate");
          const desc = searchParams.get("desc");

          const page = parseInt(searchParams.get("page") || "1");
          const limit = parseInt(searchParams.get("limit") || "10");

          if (!userId || !Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });

          if (!categoryId || !Types.ObjectId.isValid(categoryId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });

          await connectToDB();

          const user = await User.findById(userId);

          if (!user) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });

          const category = await Category.findById(categoryId);

          if (!category) return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 400 });

          const filter: any = {
               user: new Types.ObjectId(userId),
               category: new Types.ObjectId(categoryId),
          }

          // check if the keyword exists in the title or the description
          if (searchKeywords) {
               filter.$or = [
                    {
                         title: { $regex: searchKeywords, $options: "i" },
                         // i => means search for both lowercase and uppercase
                    },
                    {
                         description: { $regex: searchKeywords, $options: "i" },
                    }
               ]
          }

          if (startDate && endDate) {
               filter.createdAt = {
                    $gte: new Date(startDate), // greater than equal to start date
                    $lte: new Date(endDate), // less than equal to end date
               }
          } else if (startDate) {
               filter.createdAt = {
                    $gte: new Date(startDate), // greater than equal to start date
               }
          } else if (endDate) {
               filter.createdAt = {
                    $lte: new Date(endDate), // less than equal to end date
               }
          }

          const skip = (page - 1) * limit;

          const blogs = await Blog.find(filter)
               .sort({ createdAt: desc ? 'desc' : 'asc' })
               .skip(skip)
               .limit(limit);

          return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(dashboard)/blogs/route.ts/GET : " + error.message, { status: 500 });
     }
}

export const POST = async (request: Request) => {
     try {
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");
          const categoryId = searchParams.get("categoryId");

          const body = await request.json();
          const { title, description } = body;

          if (!userId || !Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });

          if (!categoryId || !Types.ObjectId.isValid(categoryId)) return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });

          await connectToDB();

          const user = await User.findById(userId);

          if (!user) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });

          const category = await Category.findById(categoryId);

          if (!category) return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 400 });

          const newBlog = new Blog({
               title,
               description,
               user: new Types.ObjectId(userId),
               category: new Types.ObjectId(categoryId),
          })

          await newBlog.save();

          return new NextResponse(JSON.stringify({ message: "Blog is created", blog: newBlog }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(dashboard)/blogs/route.ts/POST : " + error.message, { status: 500 });
     }
}