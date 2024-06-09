import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
     {
          title: { type: "string", required: true },
          description: { type: "string", required: true },
          user: { type: Schema.Types.ObjectId, ref: "User", required: true },
          category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
     },
     {
          timestamps: true,
     }
)

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;