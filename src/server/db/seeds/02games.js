
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('games').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('games').insert({user_id: 1, name: 'Tomb Raider: Definitive Edition', "time-plays": '00000-00000-01000-00100-00000-00000-00000'}),
        knex('games').insert({user_id: 2, name: 'Tomb Raider: Definitive Edition', "time-plays": '00110-00100-00010-00010-10000-00100-00110'}),
        knex('games').insert({user_id: 3, name: 'Tomb Raider: Definitive Edition', "time-plays": '01100-01000-01100-01000-01100-01000-01100'})
      ]);
    });
};
