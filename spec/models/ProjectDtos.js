module.exports.ProjectCreatePostDto = function(_name, _git) {
    return {
        "git" : _git,
        "name" : _name
    };
};

module.exports.ProjectCreateResponseDto = function(_href, _git) {
    return {
        "_href": _href,
        "git": _git
    };
};

module.exports.ProjectGetResponseDto = function(_git) {
    return {
        "git" : _git
    };
};

module.exports.ProjectUpdatePutDto = function(_git) {
    return {
        "git" : _git
    };
};

module.exports.ProjectUpdatePutResponseDto = function(_git) {
    return {
    "git" : _git
    };
};
