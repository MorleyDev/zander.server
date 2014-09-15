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

module.exports.ProjectGetCollectionResponseDto = function (projects) {
    return {
        "count": projects.length,
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
