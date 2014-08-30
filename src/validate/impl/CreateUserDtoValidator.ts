module validate.impl {
    export class CreateUserDtoValidator implements Validator {
        public apply(input:model.HttpRequest):validate.ValidationResult {
            return ValidateCreateUserDto(input.body);
        }
    }
}
