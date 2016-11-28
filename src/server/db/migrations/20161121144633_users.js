
exports.up = function(knex, Promise) {
  return knex.schema.createTable("games", function(table) {
    table.integer("user_id")
    table.string("name")
    table.string("time-plays")
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("games")
};
