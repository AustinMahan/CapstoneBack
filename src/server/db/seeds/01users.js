
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({username: 'test1'}),
        knex('users').insert({username: 'test2'}),
        knex('users').insert({username: 'test3'})
      ]);
    });
};
