module validate {
    export class ValidatorFactory {
        private validators : any  = {
            "CreateUserDto": new impl.CreateUserDtoValidator(),
            "UpdateUserDto": new impl.UpdateUserDtoValidator(),
            "username": new impl.UsernameTargetValidator(),

            "CreateProjectDto": new impl.CreateProjectDtoValidator(),
            "UpdateProjectDto": new impl.UpdateProjectDtoValidator(),
            "ProjectName": new impl.ProjectTargetValidator(),
            "ProjectCollection": new impl.GetProjectCollectionValidator()
        };

        public get(type: string) : Validator {
            var validator = this.validators[type];
            if (!validator)
                throw "Unrecognised validator: " + type;

            return validator;
        }
    }
}