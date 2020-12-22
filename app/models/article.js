// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  length: Number,
  weigth: Number,
  voice: String,
  waist: Number,
  foot: Number
});


mongoose.model('Person', PersonSchema);