const usersData = require('../../../data/users')
const hobbiesData = require('../../../data/hobbies')
const postsData = require('../../../data/posts')

const createPost = (knex, post, name) =>
  knex('users')
    .where('name', name)
    .first()
    .then(user => {
      const { id, content } = post
      return knex('posts').insert({
        id,
        content,
        userId: user.id,
      })
    })

const createHobby = (knex, hobbyObj, name) =>
  knex('users')
    .where('name', name)
    .first()
    .then(user => {
      const { hobby, id } = hobbyObj
      return knex('hobbies').insert({
        id,
        hobby,
        userId: user.id,
      })
    })

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() => knex('hobbies').del())
    .then(() => knex('posts').del())
    .then(() => knex('users').insert(usersData))
    .then(() => {
      const postsPromises = postsData.map(post =>
        createPost(knex, post, post.name),
      )
      return Promise.all(postsPromises)
    })
    .then(() => {
      const hobbiesPromises = hobbiesData.map(hobby =>
        createHobby(knex, hobby, hobby.name),
      )
      return Promise.all(hobbiesPromises)
    })
}
