const bcrypt = require("bcrypt");

function bcrypting(password) {
  const salt = bcrypt.genSaltSync(15);

  return bcrypt.hashSync(password, salt);
}

module.exports = bcrypting;
