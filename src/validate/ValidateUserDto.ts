/// <reference path="../model/dto/CreateUserDto.ts" />

module validate {
    function _ValidateEmail(email : string) {
        if (!email)
            return { success: false, reason: "E-Mail Not Provided" };
        return { success: true, reason: undefined };
    }

    export function _ValidateUsername(username: string) {
        if (!username)
            return { success: false, reason: "Username Not Provided" };
        if (username.length < 3 || username.length > 20)
            return { success: false, reason: "Username Not Between 3-20 Characters" };
        if (!username.match("^[a-zA-Z0-9_\\-]*$"))
            return { success: false, reason: "Username Must Only Contain Alphanumeric Characters or Underscore" };
        return { success: true, reason: undefined };
    }

    export function _ValidatePassword(password : string) {
        if (!password)
            return { success: false, reason: "Password Not Provided" };
        if (password.length < 3)
            return { success: false, reason: "Passwords must be 3 or more characters" };
        return { success: true, reason: undefined };
    }

    export function ValidateEmail(email : string, success, failure) {
        var result = _ValidateEmail(email);
        if (result.success)
            success();
        else
            failure(result.reason);
    }

    export function ValidateUsername(username : string, success, failure) {
        var result = _ValidateUsername(username);
        if (result.success)
            success();
        else
            failure(result.reason);
    }

    export function ValidatePassword(password : string, success, failure) {
        var result = _ValidatePassword(password);
        if (result.success)
            success();
        else
            failure(result.reason);
    }

    export function ValidateCreateUserDto(dto : model.dto.CreateUserDto, success, failure) {
        ValidateEmail(dto.email, function() {
            ValidateUsername(dto.username, function () {
                ValidatePassword(dto.password, function () {
                    success(dto);
                }, failure);
            }, failure);
        }, failure);
    }

    export function ValidateUpdateUserDto(dto : model.dto.CreateUserDto, success, failure) {
        ValidateEmail(dto.email, function () {
            ValidatePassword(dto.password, function () {
                success(dto);
            }, failure);
        }, failure);
    }
}
