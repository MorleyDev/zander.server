function ProjectCreatePostDto(_name, _git) {
    this["git"]= _git;
    this["name"] = _name;
    return this;
}

function ProjectCreateResponseDto(_name, _git) {
    this["name"] = _name;
    this["git"] = _git;
    return this;
}

function ProjectGetResponseDto(_git) {
    this["git"] = _git;
    return this;
}

function ProjectUpdatePutDto(_git) {
    this["git"] = _git;
    return this;
}

function ProjectUpdatePutResponseDto(_git) {
    this["git"] = _git;
    return this;
}
