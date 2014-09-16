module validate.impl {
    export class GetProjectCollectionValidator implements validate.Validator {
        public apply(input:model.HttpRequest):validate.ValidationResult {
            if (input.query.start != null) {
                if (isNaN(input.query.start) || input.query.start.toString().match(/^[0-9]+$/) == null || input.query.start < 0)
                    return new validate.ValidationResult(false, "Start index must be a positive integeral");
            }
            if (input.query.count != null) {
                if (isNaN(input.query.count) || input.query.count.toString().match(/^[0-9]+$/) == null || input.query.count <= 0)
                    return new validate.ValidationResult(false, "Count must be a positive integeral");
                
            }
            return new validate.ValidationResult(true);
        }
    }
}

