exports.up = function(knex, Promise) {
  return knex.schema.createTable('hobbies', table => {
    table
      .uuid('id')
      .notNull()
      .primary()
    table
      .enu('hobby', [
        'SPORTS',
        'ARTS',
        'MUSIC',
        'READING',
        'TRAVEL',
        'DINING',
        'CODING',
      ])
      .nullable()
    table
      .uuid('userId')
      .references('users.id')
      .notNull()
    table
      .timestamp('createdAt')
      .defaultTo(knex.fn.now())
      .notNull()
    table
      .timestamp('updatedAt')
      .defaultTo(knex.fn.now())
      .notNull()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('hobbies')
}
