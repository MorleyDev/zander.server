/// <reference path='../model/net/CreateUserDto.ts'/>
/// <reference path='../model/net/UpdateUserDto.ts'/>
/// <reference path='ValidationResult.ts'/>

module validate {
    function ValidatePassword(password : string) : ValidationResult {
        if (!password)
            return new ValidationResult(false, "Password Not Provided");

        if (password.length < 3)
            return new ValidationResult(false, "Passwords must be 3 or more characters");

        return new ValidationResult(true);
    }

    function ValidateEmail(email : string) : ValidationResult {
        if (!email)
            return new ValidationResult(false, "E-Mail Not Provided");

        return new ValidationResult(true);
    }

    export function ValidateUsername(username: string) {
        if (!username)
            return new ValidationResult(false, "Username Not Provided");

        if (username.length < 3 || username.length > 20)
            return new ValidationResult(false, "Username Not Between 3-20 Characters");

        if (!username.match("^[a-zA-Z0-9_\\-]*$"))
            return new ValidationResult(false, "Username Must Only Contain Alphanumeric Characters or Underscore");

        return new ValidationResult(true);
    }

    export function ValidateCreateUserDto(dto : model.net.CreateUserDto) {
        var validEmail = ValidateEmail(dto.email);
        if (!validEmail.success)
            return validEmail;

        var validUsername = ValidateUsername(dto.username);
        if (!validUsername.success)
            return validUsername;

        var validPassword = ValidatePassword(dto.password);
        if (!validPassword.success)
            return validPassword;

        return new ValidationResult(true);
    }

    export function ValidateUpdateUserDto(dto : model.net.UpdateUserDto) {
        var validEmail = ValidateEmail(dto.email);
        if (!validEmail.success)
            return validEmail;

        var validPassword = ValidatePassword(dto.password);
        if (!validPassword.success)
            return validPassword;

        return new ValidationResult(true);
    }
}
