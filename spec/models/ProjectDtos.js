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

module.exports.ProjectNameValidCharacters = function () { 
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.1234567890"; 
};

module.exports.ProjectNameInvalidCharacters = function () { 
    return " @#\"\'£$^*!"; 
};

module.exports.ValidProjectName = function () {
    var validCharacters = this.ProjectNameValidCharacters();
    var length = Math.floor(3 + Math.random() * 18);
    var name = "";
    for (var i = 0; i < length; ++i) {
        var index = Math.floor(Math.random() * validCharacters.length);
        name += validCharacters.charAt(index);
    }
    return name;
}

module.exports.InvalidShortProjectName = function () {
    var validCharacters = this.ProjectNameValidCharacters();
    var name = "";
    name += validCharacters.charAt(Math.floor(Math.random() * validCharacters.length));
    return name;
}

module.exports.InvalidLongProjectName = function () {
    var validCharacters = this.ProjectNameValidCharacters();
    var length = 21 + Math.floor(Math.random() * 100);
    var name = "";
    for (var i = 0; i < length; ++i) {
        var index = Math.floor(Math.random() * validCharacters.length);
        name += validCharacters.charAt(index);
    }
    return name;
}

module.exports.InvalidCharactersProjectName = function () {
    var invalidCharacters = this.ProjectNameInvalidCharacters();
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
    var validCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var length = Math.floor(1 + Math.random() * 18);
    var vcs = "";
    for (var i = 0; i < length; ++i) {
        var index = Math.floor(Math.random() * validCharacters.length);
        vcs += validCharacters.charAt(index);
    }
    return vcs;
}

module.exports.GitVcs = function (href) {
    return {
        "vcs": "git",
        "href": href
    };
}
