module validate.impl {
    export class UpdateProjectDtoValidator implements Validator {
        public apply(input:model.HttpRequest):validate.ValidationResult {
            return ValidateUpdateProjectDto(input.body);
        }
    }
}

