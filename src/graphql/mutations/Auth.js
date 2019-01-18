const User = require('../../models/User')
const config = require('../../../config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginUser = async (obj, { email, password }) => {
  const user = await User.query().findOne('email', email)

  if (!user) {
    return {
      error: 'Email does not exist.',
    }
  }

  if (!user) {
    return {
      error: 'Password not provided',
    }
  }
  // validating password
  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return {
      error: 'Invalid password.',
    }
  }
  // object w user ID
  const payload = { id: user.id }

  // encode token with this object containing the ID and encrypt token
  const token = jwt.sign(payload, config.tokenSecret)
  return {
    user,
    token,
  }
}

const resolver = {
  Mutation: { loginUser },
}

module.exports = resolver
