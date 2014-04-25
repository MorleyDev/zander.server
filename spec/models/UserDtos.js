module.exports.CreateUserPostDto = function(username, email, password) {
    this["username"] = username;
    this["email"] = email;
    this["password"] = password;
    return this;
};

module.exports.CreateUserPostResponseDto = function(username, email, href)
{
    this["username"] = username;
    this["email"] = email;
    this["_href"] = href;
    return this;
};

module.exports.CreateUserGetResponseDto = function(username, email) {
    this["username"] = username;
    this["email"] = email;
    return this;
};
