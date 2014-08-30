module validate.impl {
    export class UpdateUserDtoValidator implements Validator {
        public apply(input:model.HttpRequest):validate.ValidationResult {
            return ValidateUpdateUserDto(input.body);
        }
    }
}
