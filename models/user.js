const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(db) {
   return {
      auth: async function(user) {
         try {
            const { email_address, password } = user;
            const hashQueryResult = await db.raw(
               `SELECT auth.hash, users.* FROM users
               INNER JOIN auth on users.uuid=auth.user_uuid
               WHERE users.email_address=? AND auth.user_uuid=users.uuid`, [email_address]
            );
   
            if(hashQueryResult.rows.length) {
               const isAuthSuccessful = await bcrypt.compare(password, hashQueryResult.rows[0].hash);
               delete hashQueryResult.rows[0].hash;
               return isAuthSuccessful ? hashQueryResult.rows[0] : {
                  error: 1,
                  message: 'Failed to sign in.'
               };
            }
            return {
               error: 1,
               message: 'Failed to sign in.'
            };
         }
         catch (error) {
            return {
               message: 'CFailed to sign in.',
               error,
            };
         }
      },
      create: async function(newUser) {
         try {
            const { username, email_address } = newUser;
            const userQueryResult = await db('users').where('username', username).select('username');
            const emailQueryResult = await db('users').where('email_address', email_address).select('email_address')

            if (!userQueryResult.length && !emailQueryResult.length) {
               const hash = await bcrypt.hash(newUser.password, saltRounds);
               delete newUser.password;
               let user = await db('users').insert(newUser, ['*']);

               await db('auth').insert({user_uuid: user[0].uuid, hash});
               return user[0];
            }
            return {
               message: 'A user already exists with that username/email address',
               error: 1,
            };
         }
         catch (error) {
            return {
               message: 'Could not create the new user',
               error,
            };
         }
      },
      getUserProfile: async function (userUUID) {
         try {
            const user = await db.raw(
               `SELECT * FROM users
               WHERE uuid=?`, [userUUID]
            );

            if (user.length) {
               return user[0];
            }
            return {
               message: 'Failed to get user.',
               error: 1,
            };
         }
         catch (error) {
            console.log(error);
            return {
               message: 'Could not get the user.',
               error,
            };
         }
      },
      updateEntries: async function (userUUID, entries) {
         try {
            entries = parseInt(entries);
            entries++;
            const userEntries = await db('users').where('uuid', userUUID).update({ entries }, ['entries']);
            return userEntries[0];
         }
         catch(error) {
           return {
             error: 1,
             message: error
           };
         }
       }
   }
}