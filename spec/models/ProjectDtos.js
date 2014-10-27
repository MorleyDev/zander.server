module.exports.ProjectCreatePostDto = function (name, src) {
    return {
        "src": src,
        "name" : name
    };
};

module.exports.ProjectCreateResponseDto = function (href, src) {
    return {
        "_href": href,
        "src": src
    };
};

module.exports.ProjectGetResponseDto = function (src) {
    return {
        "src": src
    };
};

module.exports.ProjectGetCollectionResponseDto = function (total, projects) {
    return {
        "_count": projects.length,
        "_total": total,
        "projects": projects
    };
};

module.exports.ProjectUpdatePutDto = function (src) {
    return {
        "src": src
    };
};

module.exports.ProjectUpdatePutResponseDto = function (src) {
    return {
        "src": src
    };
};

module.exports.ValidProjectName = function () {
    return GenerateRandomString(validProjectNameCharacters, 3, 20);
}

module.exports.InvalidShortProjectName = function () {
    return GenerateRandomString(validProjectNameCharacters, 1, 2);
}

module.exports.InvalidLongProjectName = function () {
    return GenerateRandomString(validProjectNameCharacters, 21, 100);
}

var validProjectNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.1234567890";

module.exports.InvalidCharactersProjectName = function () {
    var invalidCharacters = " @\"\'£$^*!";
    var validProjectName = this.ValidProjectName();
    var charToReplaceIndex = Math.floor(Math.random() * validProjectName.length);
    
    var s = validProjectName.split('');
    s[charToReplaceIndex] = invalidCharacters.charAt(Math.floor(Math.random() * invalidCharacters.length));
    return s.join('');
}

module.exports.InvalidProjectName = function () {
    var x = Math.random();
    if (x > 0.6666)
        return this.InvalidLongProjectName();

    if (x > 0.3333)
        return this.InvalidShortProjectName();

    return this.InvalidCharactersProjectName();
}

module.exports.InvalidVcs = function () {
    var vcs = GenerateRandomString("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 1,100);
    return { 
        "vcs": vcs, 
        "href":"http://someurl/maybegit.whoknows"
    };
}

module.exports.GitVcs = function (href) {
    return this.Vcs("git", href);
}

module.exports.Vcs = function (vcs, href) {
    return {
        "vcs": vcs,
        "href": href
    };
}

var GenerateRandomString = function (characters, minLength, maxLength) {
    var length = Math.floor(minLength + Math.random() * (maxLength - minLength));
    var vcs = "";
    for (var i = 0; i < length; ++i) {
        var index = Math.floor(Math.random() * characters.length);
        vcs += characters.charAt(index);
    }
    return vcs;
}
