const bcryptjs = require('bcryptjs');

const bcryptService = () => {
  const password = (user) => {
    const salt = bcryptjs.genSaltSync();
    const hash = bcryptjs.hashSync(user.password, salt);

    return hash;
  };

  const comparePassword = (pw, hash) => {
    bcryptjs.compareSync(pw, hash)
  };

  return {
    password,
    comparePassword,
  };
};

module.exports = bcryptService;
