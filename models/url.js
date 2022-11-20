const mongoose = require("mongoose")

const urlSchema = mongoose.Schema({
  codeUrl: String,
  longUrl: {
    type: String, 
    required: [true, "Le champ doit être remplis !"],
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