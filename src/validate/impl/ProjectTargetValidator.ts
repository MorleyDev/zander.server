module validate.impl {
    export class ProjectTargetValidator implements Validator {
        public apply(input:model.HttpRequest):validate.ValidationResult {
            return ValidateProjectName(input.parameters.target);
        }
    }
}

