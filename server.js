const fastify = require("fastify")({logger: false})
const mongoose = require("mongoose")
const Url = require("./models/url")
const crypto = require("crypto")
const path = require("path")
require("dotenv").config()


fastify.register(require("@fastify/formbody"))
fastify.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs")
  },
  root: path.join(__dirname, "views")
})

mongoose.connect(process.env.MONGO_URI, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("Connection réussie à la base mongoDb"))
  .catch((error) => console.log(error))


const getOptions = {
  schema: {
    body: {
      type: "object",
      required: ["longUrl"],
      properties: {
        longUrl: {type: "string"}
      }
    },
    response: {
      201: {
        type: "object",
        properties: {
          codeUrl:{ type: "string"},
          longUrl:{ type: "string"},
          shortUrl:{ type: "string"},
          create_at:{ type: "string"}
        }
      }
    }
  }
}


fastify.post("/url", async (req, reply) => {

  const code = crypto.randomBytes(8).toString("base64").slice(0, 8)

  const url = new Url({
    ...req.body,
    shortUrl: `${req.protocol}://${req.hostname}/${code}`,
    codeUrl: code
  })

  try{
    await url.save()
    reply.redirect("/")
    
  }catch(err){
    reply.code(400).send("creation failed")
    console.log(err)
  }

})

fastify.get("/", (req, reply) => {
  reply.view("index.ejs", {data: "text", text: "benamar mehdi"})
})

fastify.listen({port: 5000}, (err) => {
  if(err){
    fastify.log.error(err)
    process.exit(1)
  }
})