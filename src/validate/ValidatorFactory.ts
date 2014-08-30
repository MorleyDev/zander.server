module validate {
    export class ValidatorFactory {
        private validators : any  = {
            "CreateUserDto": new impl.CreateUserDtoValidator(),
            "UpdateUserDto": new impl.UpdateUserDtoValidator(),
            "username": new impl.UsernameTargetValidator(),

            "CreateProjectDto": new impl.CreateProjectDtoValidator(),
            "UpdateProjectDto": new impl.UpdateProjectDtoValidator(),
            "projectName": new impl.ProjectTargetValidator()
        };

        public get(type: string) : Validator {
            var validator = this.validators[type];
            if (!validator)
                throw "Unrecognised validator: " + type;

            return validator;
        }
    }
}