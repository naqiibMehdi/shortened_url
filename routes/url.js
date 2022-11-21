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
      await url.save()
      reply.redirect(302, "/")

    } catch (err) {
     return new Error(err)
    }
  }
}


const getOptions = {
  handler: async (req, reply) => {
    const result = await Url.find().sort({_id: -1}).limit(1)
    return reply.view("index.ejs", {result})
  }
}

const getOneOptions = {
  handler: async (req, reply) => {
    if (req.params.code) {
      const url = await Url.findOne({ codeUrl: req.params.code })
      if (url) {
        reply.redirect(302, url.longUrl)
      }
    }
  }
}

function routes (fastify, opts, done){
  fastify.post("/url", postOptions)
  fastify.get("/", getOptions)
  fastify.get("/:code", getOneOptions)
  done()
}

module.exports = routes