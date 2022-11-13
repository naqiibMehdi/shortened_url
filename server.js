const fastify = require("fastify")({logger: false})
const mongoose = require("mongoose")
const Url = require("./models/url")
const crypto = require("crypto")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("Connection réussie à la base mongoDb"))
  .catch((err) => console.log(error))


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


fastify.post("/url", getOptions, async (req, reply) => {

  const code = crypto.randomBytes(8).toString("base64").slice(0, 8)

  const url = new Url({
    ...req.body,
    shortUrl: `${req.protocol}://${req.hostname}/${code}`,
    codeUrl: code
  })

  try{
    const result = await url.save()
    reply.code(201).send(result)
  }catch(err){
    reply.code(400).send("creation failed")
  }
  


})

fastify.listen({port: 5000}, (err) => {
  if(err){
    fastify.log.error(err)
    process.exit(1)
  }
})