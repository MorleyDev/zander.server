module validate {

    export function ValidateProjectName(name : string, success, failure) {
        if (!name)
            failure("Project Name Not Provided");
        else if (name.length < 3 || name.length > 20)
            failure("Project Name Not Between 3-20 Characters");
        else if (!name.match("^[a-zA-Z0-9_\\-]*$"))
            failure("Project Name Must Only Contain Alphanumeric Characters or Underscore");
        else
            success(name);
    }

    export function ValidateProjectGit(git : string, success, failure) {
        if (!git)
            failure("Password Not Provided");
        else
            success(git)
    }

    export function ValidateCreateProjectDto(dto, success, failure) {
        ValidateProjectName(dto.name, function(name) {
            ValidateProjectGit(dto.git, function(git) {
                success(dto);
            }, failure)
        }, failure);
    }

    export function ValidateUpdateProjectDto(dto, success, failure) {
        ValidateProjectGit(dto.git, function (git) {
            success(dto);
        }, failure)
    }
}
