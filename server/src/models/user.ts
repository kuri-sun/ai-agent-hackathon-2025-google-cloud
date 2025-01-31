import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
  _id: Types.ObjectId, // Explicitly add _id to the type
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: false },
});

type User = mongoose.InferSchemaType<typeof userSchema>;
const _User = mongoose.model("User", userSchema);

export const User = {
  findById: async ({ id }: { id: string }): Promise<User | null> => {
    return _User.findById(id);
  },
  findByEmail: async ({ email }: { email: string }): Promise<User | null> => {
    return _User.findOne({ email });
  },
  create: async ({
    name,
    email,
    avatar,
  }: {
    name?: string;
    email: string;
    avatar?: string;
  }): Promise<User> => {
    let id = new mongoose.Types.ObjectId();
    const user = await _User.create({
      _id: id,
      name,
      email,
      avatar,
    });
    return user;
  },
  update: async ({
    id,
    name,
    avatar,
  }: {
    id: string;
    name: string;
    avatar?: string;
  }): Promise<User | null> => {
    return _User.findByIdAndUpdate({ _id: id }, { name, avatar });
  },
  delete: async ({ id }: { id: string }): Promise<User | null> => {
    return _User.findByIdAndDelete(id);
  },
};
