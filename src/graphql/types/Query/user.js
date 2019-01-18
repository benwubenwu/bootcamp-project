const User = require('../../../models/User')
const { raw } = require('objection')

const userResolver = async (obj, args, context) => {
  // TODO: Write a resolver which returns a user given a user id.

  const user = await User.query().findById(args.id)
  if (!user) {
    return {
      error: {
        message: 'Could not get user',
      },
    }
  }
  return user
}

const usersResolver = async (obj, args, context) => {
  const { substr, hometown, house, concentration, hobbies } = args
  const query = User.query()
  if (substr) {
    query.where(raw('name'), 'like', `%${substr}%`)
  }

  if (hometown) {
    query.where(raw('hometown'), 'like', `%${hometown}%`)
  }

  if (house) {
    query.where(raw('house'), 'like', `%${house}%`)
  }
  if (concentration) {
    query.where(raw('concentration'), 'like', `%${concentration}%`)
  }
  if (hobbies) {
    query.where(raw('hobbies'), 'like', `%${hobbies}%`)
  }
  const users = await query
  return users
  /* TODO: Write a resolver which returns a list of all users.
  
  Once you're done, implement the following pieces of functionality one by one:

  If any of the following arguments are provided, apply the corresponding filter:
    - substr: include only users whose name contains the substring
    - hometown: include only users from that hometown
    - house: include only users from that house
    - concentration: include only users who have that concentration
    - hobbies: include only users who have indicated one of the hobbies in that list
  */
}

const resolver = {
  Query: {
    user: userResolver,
    users: usersResolver,
  },
}

module.exports = resolver
