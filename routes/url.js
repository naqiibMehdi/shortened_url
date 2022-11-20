const crypto = require("crypto")
const Url = require("../models/url")


const postOptions = {
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
          longUrl:{ type: "string"},
          shortUrl:{ type: "string"},
        }
      }
    }
  },
  handler: async (req, reply, next) => {
    const code = crypto.randomBytes(8).toString("base64").slice(0, 8)

    const url = new Url({
      ...req.body,
      codeUrl: code,
      shortUrl: `${req.protocol}://${req.hostname}/${code}`
    })

    try {
      const result = await url.save()
      reply.view("index.ejs", {result})
      reply.redirect(302, "/")

    } catch (err) {
     return new Error(err)
    }
  }
}


function routes (fastify, opts, done){
  fastify.post("/url", postOptions)
  fastify.get("/", (req, reply) => {
    reply.view("index.ejs", {result})
  })
  done()
}

module.exports = routes