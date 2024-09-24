const bcrypt = require('bcryptjs'); // Make sure bcryptjs is installed

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePasswords };
