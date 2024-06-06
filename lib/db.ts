import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectToDB() {
     const connectionState = mongoose.connection.readyState;

     if (connectionState === 1) {
          console.log("Already connected.");
          return;
     } else if (connectionState === 2) {
          console.log("Connecting...");
          return;
     }

     try {
          mongoose.connect(MONGODB_URI!, {
               dbName: 'restapis-next14',
               bufferCommands: true,
          });

          console.log("Connected");
     }

     catch (error: any) {
          console.log("Error: ", error);
          throw new Error("Error: ", error);
     }
}