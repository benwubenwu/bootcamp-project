const express = require('express')
const { createServer } = require('http')

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { Model } = require('objection')
const Knex = require('knex')

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const knexfile = require('./knexfile')
const User = require('./src/models/User')
const schema = require('./src/graphql')
const { tokenSecret, port } = require('./config')

const knex = Knex(knexfile.development)
Model.knex(knex)
knex.migrate.latest()

const app = express()

// Middleware to handle CORS
app.use((req, res, next) => {
  let oneof = false
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    oneof = true
  }
  if (req.headers['access-control-request-method']) {
    res.header(
      'Access-Control-Allow-Methods',
      req.headers['access-control-request-method'],
    )
    oneof = true
  }
  if (req.headers['access-control-request-headers']) {
    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'],
    )
    oneof = true
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365)
  }
  if (oneof && req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  return next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(async req => {
    const token = req.headers.authorization
    if (token) {
      // decode the token using tokenSecret
      const decoded = jwt.verify(token, tokenSecret)
      const user = await User.query().findById(decoded.id)
      return {
        schema,
        context: {
          user,
        },
      }
    }
    return {
      schema,
    }
  }),
)

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
)

const server = createServer(app)

app.listen(port, () => {
  console.log(`Apollo Server is now running on http://localhost:${port}`)
})

module.exports = app
