module validate.impl {
    export class UsernameTargetValidator implements Validator {
        public apply(input:model.HttpRequest):validate.ValidationResult {
            return ValidateUsername(input.parameters.target);
        }
    }
}

