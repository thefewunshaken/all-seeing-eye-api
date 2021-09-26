

module.exports = function(User) {
   return {
      signup: async function(req, res) {
         try {
            if (!req.body.email || !req.body.username || !req.body.plainTextPassword) {
              return res.status(400).send({
                message: 'Please provide an email, username, and a password to sign up.'
              });
            }
            const user = await User.create({
               first_name: req.body.firstName,
               last_name: req.body.lastName,
               username: req.body.username,
               email_address: req.body.email,
               joined_at: new Date(),
               password: req.body.plainTextPassword
            });

            if (user.error) {
               return res.status(400).send({
                  message: user.message,
                  error: user.error
               });
            }
            return res.status(200).json(user);
         }
         catch (err) {
            console.log('@User.signup()', err);
            return res.status(400).send({
               message: 'Something went wrong.',
               error: err
            })
         }
      },
      signin: async function(req, res) {
         try {
            if(!req.body.email || !req.body.plainTextPassword) {
              return res.status(400).send({
                 error: 1,
                 message: 'Please provide your email and password'
              });
            }
            const user = await User.auth({ email_address: req.body.email, password: req.body.plainTextPassword });
          
            if (user.error) {
               return res.status(400).send({
                  error: 1,
                  message: 'Error signing in.'
               })
            }
            return res.status(200).send(user);
         }
         catch (err) {
            console.log('@User.signin()', err);
            return res.status(400).send({
               message: 'Something went wrong.',
               error: err
            })
         }
      }
   }
}
