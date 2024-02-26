const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
});

// virtual for book's URL
BookSchema.virtual('url').get(function () {
  // we don't use an arrow function as we'll need the this object
  return `/catalog/book/${this._id}`;
});

// export model
module.exports = mongoose.model('Book', BookSchema);
