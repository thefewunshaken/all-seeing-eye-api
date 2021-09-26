
module.exports = function(User) {
  return {
    getUserProfile: async function (req, res) {
      const { username } = req.params;
      const { userUUID } = req.body;
      const existingUser = await User.getUserProfile(userUUID);

      if (!userUUID) {
        return res.status(400).json('You need to be logged in to get user.');
      }
    
      if (!existingUser.error) {
        return res.status(200).json(existingUser)
      }
      return res.status(404).json('No such user');
    },
    updateEntries: async function (req, res) {
      try {
        const { userUUID, entries } = req.body;
    
        if (!userUUID || !entries) {
          return res.status(400).send({
            message: 'Failed to update the user entries count.'
          });
        }

        const userEntries = await User.updateEntries(userUUID, entries);

        return res.status(200).json(userEntries);
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
