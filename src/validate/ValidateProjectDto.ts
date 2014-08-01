/// <reference path='../model/net/CreateProjectDto.ts'/>
/// <reference path='../model/net/UpdateProjectDto.ts'/>
/// <reference path='ValidationResult.ts'/>

module validate {
    function ValidateProjectName(name:string):ValidationResult {
        if (!name)
            return new ValidationResult(false, "Project Name Not Provided");

        if (name.length < 3 || name.length > 20)
            return new ValidationResult(false, "Project Name Not Between 3-20 Characters");

        if (!name.match("^[a-zA-Z0-9_\\-]*$"))
            return new ValidationResult(false, "Project Name Must Only Contain Alphanumeric Characters or Underscore");

        return new ValidationResult(true);
    }

    function ValidateProjectGit(git:string):ValidationResult {
        if (!git)
            return new ValidationResult(false, "Password Not Provided");

        return new ValidationResult(true);
    }

    export function ValidateCreateProjectDto(dto:model.net.CreateProjectDto):ValidationResult {
        var result = ValidateProjectName(dto.name);
        if (result.success)
            return ValidateProjectGit(dto.git);

        return result;
    }

    export function ValidateUpdateProjectDto(dto:model.net.UpdateProjectDto):ValidationResult {
        return ValidateProjectGit(dto.git);
    }
}
