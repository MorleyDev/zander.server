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

module.exports.ValidProjectName = function () {
    var validCharacters = this.ProjectNameValidCharacters();
    var length = Math.floor(2 + Math.random() * 19);
    var name = "";
    for (var i = 0; i < length; ++i) {
        var index = Math.floor(Math.random() * validCharacters.length);
        name += validCharacters.charAt(index);
    }
    return name;
}


