import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  createdAt?: Date;
  updatedAt?: Date;

}

// Define schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiry: Number,

  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log("Password hashed for user:", user.email);  // ✅ Debugging
    next();
  } catch (error: any) {
    next(error);
  }
});

const User = models.User || model<IUser>("User", userSchema);
export default User;



// import mongoose, { Schema, model, models, Document } from "mongoose";
// import bcrypt from "bcryptjs";

// export interface IUser extends Document {
//   email: string;
//   password: string;
//   name: string; 
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// // Define schema
// const userSchema = new Schema<IUser>({
//   name: { type: String, required: true },  // ✅ Add this
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// }, { timestamps: true });


// // Password hashing middleware
// userSchema.pre("save", async function (next) {
//   const user = this as IUser;

//   if (!user.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     console.log('Password hashed for user:', user.email);  //
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

// // Export model
// const User = models.User || model<IUser>("User", userSchema);

// export default User;
