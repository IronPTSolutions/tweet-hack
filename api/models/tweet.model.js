const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  text: {
    type: String,
    required: 'text is required',
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  }
});

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tweet',
  justOne: false,
});

schema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'tweet',
  count: true,
});

const Tweet = mongoose.model('Tweet', schema);
module.exports = Tweet;
