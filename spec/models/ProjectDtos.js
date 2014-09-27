module.exports.ProjectCreatePostDto = function (name, git) {
    return {
        "git" : git,
        "name" : name
    };
};

module.exports.ProjectCreateResponseDto = function (href, git) {
    return {
        "_href": href,
        "git": git
    };
};

module.exports.ProjectGetResponseDto = function (git) {
    return {
        "git" : git
    };
};

module.exports.ProjectGetCollectionResponseDto = function (total, projects) {
    return {
        "_count": projects.length,
        "_total": total,
        "projects": projects
    };
};

module.exports.ProjectUpdatePutDto = function (git) {
    return {
        "git" : git
    };
};

module.exports.ProjectUpdatePutResponseDto = function (git) {
    return {
        "git" : git
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
