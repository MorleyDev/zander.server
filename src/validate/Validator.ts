module validate {
    export interface Validator {
        apply(input:model.HttpRequest): validate.ValidationResult;
    }
}
