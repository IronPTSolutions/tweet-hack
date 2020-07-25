const mongoose = require("mongoose");

require('./user.model')
require("./comment.model");

const tweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    location: {
      type: {
        type: String,
        default: "Point"
      },
      coordinates: [Number]
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tweetSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "tweet",
  justOne: false,
});

tweetSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "tweet",
  justOne: false
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
