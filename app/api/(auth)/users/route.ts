import connectToDB from "@/lib/db"
import User from "@/lib/models/user";
import { NextResponse } from "next/server"

export const GET = async () => {
     try {
          await connectToDB();

          const users = await User.find();

          return new NextResponse(JSON.stringify(users), { status: 200 })

     } catch (error: any) {
          return new NextResponse("Error :: /api/(auth)/users/route.ts/GET : " + error.message, { status: 500 })
     }
}

export const POST = async (request: Request) => {
     try {
          await connectToDB();

          const body = await request.json();

          const newUser = new User(body);
          await newUser.save();

          return new NextResponse(JSON.stringify({ message: "User is created", user: newUser }), { status: 200 })
     }
     
     catch (error: any) {
          return new NextResponse("Error :: /api/(auth)/users/route.ts/POST : " + error.message, { status: 500 })
     }
}