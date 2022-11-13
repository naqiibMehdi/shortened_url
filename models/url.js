const mongoose = require("mongoose")

const urlSchema = mongoose.Schema({
  codeUrl: String,
  longUrl: {
    type: String, 
    required: true
  },
  shortUrl: String,
  create_at: {
    type: Date, 
    default: Date.now, 
    expires: 3600
  } 
})

module.exports = mongoose.model("Url", urlSchema)