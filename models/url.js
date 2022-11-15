const crypto = require("crypto")
const mongoose = require("mongoose")

const urlSchema = mongoose.Schema({
  codeUrl: {
    type: String, 
    default: crypto.randomBytes(8).toString("base64").slice(0, 8) 
  },
  longUrl: {
    type: String, 
    required: true,
    validate: {
      validator: function (url){
        return /^https?/.test(url)
      },
      message: (props) => `l'Url suivante "${props.value}" n'est pas valide !`
    }
  },
  shortUrl: String,
  create_at: {
    type: Date, 
    default: Date.now, 
    expires: 3600
  } 
})

module.exports = mongoose.model("Url", urlSchema)