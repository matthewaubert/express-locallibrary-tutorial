const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// virtual for author's full name
AuthorSchema.virtual('name').get(function () {
  // to avoid errors in cases where an author does not have either a family name or first name,
  // we want to make sure we handle the exception by returning an empty string for that case
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// virtual for author's URL
AuthorSchema.virtual('url').get(function () {
  // we don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// virtual for author's lifespan, formatted like 'Jul 12, 1817 - May 6, 1862'
AuthorSchema.virtual('lifespan').get(function () {
  const dateOfBirth = this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : '';
  const dateOfDeath = this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : '';

  return dateOfBirth || dateOfDeath ? `${dateOfBirth} - ${dateOfDeath}` : '';
});

// virtual for author's date of birth, formatted 'yyyy-MM-dd' (e.g. '2024-02-28')
AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

// virtual for author's date of death, formatted 'yyyy-MM-dd' (e.g. '2024-02-28')
AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

// export model
module.exports = mongoose.model('Author', AuthorSchema);
