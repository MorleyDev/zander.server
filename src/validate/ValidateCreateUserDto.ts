/// <reference path="../model/dto/CreateUserDto.ts" />

module validate {
    export function ValidateCreateUserDto(dto : model.dto.CreateUserDto) : boolean {
        if (!dto.email)
            return false;
        if (!dto.username)
            return false;
        if (!dto.password)
            return false;

        if (dto.password.length < 3)
            return false;
        if (dto.username.length < 3 || dto.username.length > 20)
            return false;
        if (!dto.username.match("^[a-zA-Z0-9_]*$"))
            return false;

        return true;
    }
}
