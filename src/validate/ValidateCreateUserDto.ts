/// <reference path="../model/dto/CreateUserDto.ts" />

module validate {
    export function ValidateEmail(email : string, success, failure) {
        if (!email)
            failure("E-Mail Not Provided");
        else
            success(email);
    }

    export function ValidateUsername(username : string, success, failure) {
        if (!username)
            failure("Username Not Provided");
        else if (username.length < 3 || username.length > 20)
            failure("Username Not Between 3-20 Characters");
        else if (!username.match("^[a-zA-Z0-9_\\-]*$"))
            failure("Username Must Only Contain Alphanumeric Characters or Underscore");
        else
            success(username);
    }

    export function ValidatePassword(password : string, success, failure) {
        if (!password)
            failure("Password Not Provided");
        else if (password.length < 3)
            failure("Passwords must be 3 or more characters");
        else success(password)
    }

    export function ValidateCreateUserDto(dto : model.dto.CreateUserDto, success, failure) {
        ValidateEmail(dto.email, function(email) {
            ValidateUsername(dto.username, function (username) {
                ValidatePassword(dto.password, function (password) {
                    success(dto);
                }, failure);
            }, failure);
        }, failure);
    }

    export function ValidateUpdateUserDto(dto : model.dto.CreateUserDto, success, failure) {
        ValidateEmail(dto.email, function (email) {
            ValidatePassword(dto.password, function (password) {
                success(dto);
            }, failure);
        }, failure);
    }
}
