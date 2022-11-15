const crypto = require("crypto")
const Url = require("../models/url")


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
  },
  handler: async (req, reply) => {
    const code = crypto.randomBytes(8).toString("base64").slice(0, 8)

    const url = new Url({
      ...req.body,
      shortUrl: `${req.protocol}://${req.hostname}/${code}`,
    })

    try {
      await url.save()
      reply.code(201).send("Url created !")
      reply.redirect("/")

    } catch (err) {
      reply.redirect("/")
      reply.view("index.ejs", {message: err.message})
    }
  }
}


function routes (fastify, opts, done){
  fastify.post("/url", getOptions)
  fastify.get("/", (req, reply) => {
    reply.view("index.ejs", {message: ""})
  })
  done()
}

module.exports = routes