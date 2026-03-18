import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// Interface
export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  bio?: string;
  avatar?: string;
  isGuest?: boolean;
  visitCount?: number;
  badges?: string[];
  isEmailVerified?: boolean;
  otp?: string;
  otpExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;

  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

// Schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    age: { type: Number, min: 0 },
    bio: { type: String, maxlength: 500 },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    isGuest: { type: Boolean, default: false },
    visitCount: { type: Number, default: 0 },
    badges: [{ type: String }],
    isEmailVerified: { type: Boolean, default: false },

    otp: { type: String },
    otpExpiry: { type: Date },

    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// 🔐 Hash password before save (NO next)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// 🔐 Hash password on update (NO next)
userSchema.pre("findOneAndUpdate", async function () {
  const update: any = this.getUpdate();

  if (update?.password) {
    update.password = await bcrypt.hash(update.password, 10);
    this.setUpdate(update);
  }
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ⚡ Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Model
const User = models.User || model<IUser>("User", userSchema);

export default User;