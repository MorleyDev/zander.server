/// <reference path="../model/dto/CreateUserDto.ts" />

module validate {
    export function ValidateCreateUserDto(dto : model.dto.CreateUserDto) {
        if (!dto.email)
            throw "E-Mail Not Provided";
        if (!dto.username)
            throw "Username Not Provided";
        if (!dto.password)
            throw "Password Not Provided";

        if (dto.password.length < 3)
            throw "Password Too Short";
        if (dto.username.length < 3 || dto.username.length > 20)
            throw "Username Not Between 3-20 Characters";
        if (!dto.username.match("^[a-zA-Z0-9_\\-]*$"))
            throw "Username Must Only Contain Alphanumeric Characters or Underscore";
    }
}
