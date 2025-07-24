import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) throw new Error("Email and password are required");

        try {
          await connectToDatabase();
          const user = await User.findOne({ email });
          if (!user) {
            console.log("User not found:", email);
            throw new Error("Invalid email or password");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.log("Invalid password for user:", email);
            throw new Error("Invalid email or password");
          }

          return { id: user._id.toString(), email: user.email };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
};


// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectToDatabase } from "./db"; // Update path as per your project
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "Email" },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Password",
//         },
//       },
//       async authorize(credentials, req) {
//         const { email, password } = credentials || {};

//         if (!email || !password) {
//           throw new Error("Email and password are required");
//         }

//         try {
//           await connectToDatabase();

//           const user = await User.findOne({ email });

//           if (!user) {
//             throw new Error("Invalid email or password");
//           }

//           const isPasswordValid = await bcrypt.compare(password, user.password);

//           if (!isPasswordValid) {
//             throw new Error("Invalid email or password");
//           }

//           return {
//             id: user._id.toString(),
//             email: user.email,
//           };
//         } catch (error) {
//           console.error("Error during authorization:", error);
//           throw new Error("Invalid credentials");
//         }
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async session({ session, token }) {
//       if (session.user && token.id) {
//         (session.user as { id: string }).id = token.id as string;
//       }
//       return session;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//   },
// };
