module validate.impl {
    export class CreateProjectDtoValidator implements Validator {
        public apply(request:model.HttpRequest): ValidationResult {
            return validate.ValidateCreateProjectDto(request.body);
        }
    }
}