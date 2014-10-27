module validate {

    export function ValidateCreateProjectDto(dto:model.net.CreateProjectDto):ValidationResult {
        var result = ValidateProjectName(dto.name);
        if (result.success) {
            if (!dto.src)
                return new ValidationResult(false, "src not provided");

            return ValidateProjectVcs(dto.src);
        }
        return result;
    }
    
    export function ValidateProjectName(name:string):ValidationResult {
        if (!name)
            return new ValidationResult(false, "Project Name Not Provided");

        if (name.length < 3 || name.length > 20)
            return new ValidationResult(false, "Project Name Not Between 3-20 Characters");

        if (!name.match("^[a-zA-Z0-9_\\-\\.]*$"))
            return new ValidationResult(false, "Project Name Must Only Contain Alphanumeric Characters, - or _");

        return new ValidationResult(true);
    }

    export function ValidateUpdateProjectDto(dto:model.net.UpdateProjectDto):ValidationResult {
        if (!dto.src)
            return new ValidationResult(false, "src not provided");

        return ValidateProjectVcs(dto.src);
    }
    
    function ValidateProjectVcs(src:model.net.ProjectSourceDto):ValidationResult {
        if (src.vcs != "git")
            return new ValidationResult(false, "unsupported vcs");
            
        return ValidateProjectGit(src.href);
    }

    function ValidateProjectGit(git:string):ValidationResult {
        if (!git)
            return new ValidationResult(false, "Password Not Provided");

        return new ValidationResult(true);
    }
}
