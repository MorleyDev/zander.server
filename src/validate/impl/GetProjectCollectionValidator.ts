module validate.impl {
    export class GetProjectCollectionValidator implements validate.Validator {
        public apply(input:model.HttpRequest):validate.ValidationResult {
            if (input.query.start != null) {
                if (isNaN(input.query.start) 
                || input.query.start.toString().match(/^[0-9]+$/) == null 
                || input.query.start < 0
                || input.query.start > 4294967295)
                    return new validate.ValidationResult(false, "Start index must be a positive integeral");
            }
            if (input.query.count != null) {
                if (isNaN(input.query.count) 
                || input.query.count.toString().match(/^[0-9]+$/) == null 
                || input.query.count <= 0
                || input.query.count > 1000)
                    return new validate.ValidationResult(false, "Count must be a positive integeral");
                
            }
            if (input.query['name.contains'] != null) {
                
                if (input.query['name.contains'].length < 1)
                    return new ValidationResult(false, "Project Name contains filter cannot be specified as empty");
                    
                if (input.query['name.contains'].length > 20)
                    return new ValidationResult(false, "Project Name cannot be longer than 20 characters");
                    
                if (!input.query['name.contains'].match("^[a-zA-Z0-9_\\-\\.]*$"))
                    return new ValidationResult(false, "Project Name can only contain alphanumeric characters, ., - or _");
            }
            return new validate.ValidationResult(true);
        }
    }
}

