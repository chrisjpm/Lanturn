var mongoose = require("mongoose");


var VerifierSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  token: String
}, {collection:'verifiers'});


module.exports = VerifierSchema;
