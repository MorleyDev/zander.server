/// <reference path='../model/net/CreateProjectDto.ts'/>
/// <reference path='../model/net/UpdateProjectDto.ts'/>

function ValidateProjectName(name : string) : any {
    if (!name)
        return {
            reason: "Project Name Not Provided",
            success: false
        };
    if (name.length < 3 || name.length > 20)
        return {
            reason: "Project Name Not Between 3-20 Characters",
            success: false
        };
    if (!name.match("^[a-zA-Z0-9_\\-]*$"))
        return {
            reason: "Project Name Must Only Contain Alphanumeric Characters or Underscore",
            success: false
        };
    return {
        reason: undefined,
        success: true
    };
}

function ValidateProjectGit(git : string) : any {
    if (!git)
        return {
            reason: "Password Not Provided",
            success: undefined
        };

    return {
        reason: undefined,
        success: true
    };
}

module validate {
    export function ValidateCreateProjectDto(dto : model.net.CreateProjectDto) {
        var result = ValidateProjectName(dto.name);
        if (result.success)
            return ValidateProjectGit(dto.git);

        return result;
    }

    export function ValidateUpdateProjectDto(dto : model.net.UpdateProjectDto) {
        return ValidateProjectGit(dto.git);
    }
}
