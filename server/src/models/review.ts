import mongoose, { Types } from "mongoose";

export type Review = {
  comment: string;
  level: "danger" | "warning" | "info";
  confidence: number;
};

const reviewSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  level: { type: String, enum: ["danger", "warning", "info"], required: true },
  confidence: { type: Number, required: true },
});

const reviewResultSchema = new mongoose.Schema({
  _id: Types.ObjectId, // Explicitly add _id to the type
  draftId: { type: String, required: true },
  reviews: { type: [reviewSchema], required: false, default: [] },
});

type ReviewResult = mongoose.InferSchemaType<typeof reviewResultSchema>;
const _ReviewResult = mongoose.model("Review", reviewResultSchema);

export const ReviewResult = {
  findById: async ({ id }: { id: string }): Promise<ReviewResult | null> => {
    return _ReviewResult.findById(id);
  },
  findByDraftId: async ({
    draftId,
  }: {
    draftId: string;
  }): Promise<ReviewResult | null> => {
    return _ReviewResult.findOne({ draftId });
  },
  create: async ({
    draftId,
    reviews,
  }: {
    draftId: string;
    reviews?: Review[];
  }): Promise<ReviewResult> => {
    let id = new mongoose.Types.ObjectId();
    const data = await _ReviewResult.create({
      _id: id,
      draftId,
      reviews,
    });
    return data;
  },
  update: async ({
    reviewResult,
  }: {
    reviewResult?: ReviewResult;
  }): Promise<ReviewResult | null> => {
    return _ReviewResult.findByIdAndUpdate(
      { _id: reviewResult?._id },
      reviewResult
    );
  },
  updateByDraftId: async ({
    draftId,
    reviews,
  }: {
    draftId: string;
    reviews: Review[];
  }): Promise<ReviewResult | null> => {
    if (!draftId) {
      let id = new mongoose.Types.ObjectId();
      const data = await _ReviewResult.create({
        _id: id,
        draftId,
        reviews,
      });
      return data;
    } else {
      return _ReviewResult.findOneAndUpdate(
        { draftId },
        { reviews },
        { new: true }
      );
    }
  },
  // delete: async ({ id }: { id: string }): Promise<ReviewResult | null> => {
  //   return _User.findByIdAndDelete(id);
  // },
};
