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
