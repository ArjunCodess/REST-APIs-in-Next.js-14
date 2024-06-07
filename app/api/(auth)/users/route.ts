import connectToDB from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
     try {
          await connectToDB();

          const users = await User.find();

          return new NextResponse(JSON.stringify(users), { status: 200 });

     } catch (error: any) {
          return new NextResponse("Error :: /api/(auth)/users/route.ts/GET : " + error.message, { status: 500 });
     }
}

export const POST = async (request: Request) => {
     try {
          await connectToDB();

          const body = await request.json();

          const newUser = new User(body);
          await newUser.save();

          return new NextResponse(JSON.stringify({ message: "User is created", user: newUser }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(auth)/users/route.ts/POST : " + error.message, { status: 500 });
     }
}

export const PATCH = async (request: Request) => {
     try {
          const body = await request.json();

          const { userId, newUsername } = body;

          await connectToDB();

          if (!userId || !newUsername) {
               return new NextResponse(JSON.stringify({ message: "userId or newUsername not found" }), { status: 400 });
          }

          if (!Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid userId" }), { status: 400 });

          const updatedUser = await User.findOneAndUpdate(
               { _id: new ObjectId(userId) }, // find user
               { username: newUsername }, // update the username
               { new: true } // return the updated user
          );

          if (!updatedUser) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });

          return new NextResponse(JSON.stringify({ message: "User is updated", user: updatedUser }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(auth)/users/route.ts/PATCH : " + error.message, { status: 500 });
     }
}

export const DELETE = async (request: Request) => {
     try {
          const { searchParams } = new URL(request.url);
          const userId = searchParams.get("userId");

          if (!userId) return new NextResponse(JSON.stringify({ message: "userId not found" }), { status: 400 });

          if (!Types.ObjectId.isValid(userId)) return new NextResponse(JSON.stringify({ message: "Invalid userId" }), { status: 400 });

          await connectToDB();

          const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

          if (!deletedUser) return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 400 });

          return new NextResponse(JSON.stringify({ message: "User deleted", user: deletedUser }), { status: 200 });
     }

     catch (error: any) {
          return new NextResponse("Error :: /api/(auth)/users/route.ts/DELETE : " + error.message, { status: 500 });
     }
}