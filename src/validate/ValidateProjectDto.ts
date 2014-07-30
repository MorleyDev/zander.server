
function _ValidateProjectName(name : string) : any {
    if (!name)
        return {
            reason: "Project Name Not Provided",
            success: false
        };
    else if (name.length < 3 || name.length > 20)
        return {
            reason: "Project Name Not Between 3-20 Characters",
            success: false
        };
    else if (!name.match("^[a-zA-Z0-9_\\-]*$"))
        return {
            reason: "Project Name Must Only Contain Alphanumeric Characters or Underscore",
            success: false
        };
    else
        return {
            reason: undefined,
            success: true
        };
}

function _ValidateProjectGit(git : string) : any {
    if (!git) {
        return {
            reason: "Password Not Provided",
            success: undefined
        };
    }
    return {
        reason: undefined,
        success: true
    };
}

module validate {

    export function ValidateCreateProjectDto(dto) {
        var result = _ValidateProjectName(dto.name);
        if (result.success) {
            return _ValidateProjectGit(dto.git);
        }
        return result;
    }

    export function ValidateUpdateProjectDto(dto) {
        return _ValidateProjectGit(dto.git);
    }
}
