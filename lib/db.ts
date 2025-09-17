import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env.local"
  );
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}
export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URL, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// import mongoose from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URL as string;

// if (!MONGODB_URL) {
//   throw new Error(
//     "Please define the MONGODB_URL environment variable inside .env.local"
//   );
// }

// let cached = (global as any).mongoose;
// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }
// export async function connectToDatabase() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       maxPoolSize: 10,
//     };

//     cached.promise = mongoose
//       .connect(MONGODB_URL, opts)
//       .then((mongooseInstance) => {
//         return mongooseInstance;
//       });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }
