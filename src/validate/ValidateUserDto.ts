/// <reference path='../model/net/CreateUserDto.ts'/>
/// <reference path='../model/net/UpdateUserDto.ts'/>

function ValidatePassword(password : string) {
    if (!password)
        return { success: false, reason: "Password Not Provided" };

    if (password.length < 3)
        return { success: false, reason: "Passwords must be 3 or more characters" };

    return { success: true, reason: undefined };
}

function ValidateEmail(email : string) {
    if (!email)
        return { success: false, reason: "E-Mail Not Provided" };

    return { success: true, reason: undefined };
}

module validate {

    export function ValidateUsername(username: string) {
        if (!username)
            return { success: false, reason: "Username Not Provided" };

        if (username.length < 3 || username.length > 20)
            return { success: false, reason: "Username Not Between 3-20 Characters" };

        if (!username.match("^[a-zA-Z0-9_\\-]*$"))
            return { success: false, reason: "Username Must Only Contain Alphanumeric Characters or Underscore" };

        return { success: true, reason: undefined };
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

        return { success: true, reason: undefined };
    }

    export function ValidateUpdateUserDto(dto : model.net.UpdateUserDto) {
        var validEmail = ValidateEmail(dto.email);
        if (!validEmail.success)
            return validEmail;

        var validPassword = ValidatePassword(dto.password);
        if (!validPassword.success)
            return validPassword;

        return { success: true, reason: undefined };
    }
}
