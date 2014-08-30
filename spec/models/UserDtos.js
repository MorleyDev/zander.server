module.exports.CreateUserPostDto = function (username, email, password) {

    return {
        "username" : username,
        "email" : email,
        "password" : password
    };
};

module.exports.CreateUserPutDto = function (email, password) {
    return {
        "email" : email,
        "password" : password
    };
};

module.exports.CreateUserPostResponseDto = function (username, email, href)
{
    return {
        "username" : username,
        "email" : email,
        "_href" : href
    };
};

module.exports.CreateUserGetResponseDto = function (email) {
    return {
        "email" : email
    };
};
