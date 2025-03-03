const createTokenUser = (user) => {
  return { name: user.name, userId: user._id, role: user.role };

  //   return { name, userId: _id, role };
};

module.exports = createTokenUser;
