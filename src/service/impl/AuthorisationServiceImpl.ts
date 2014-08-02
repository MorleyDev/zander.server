module service.impl {
    export class AuthorisationServiceImpl implements AuthorisationService {

        private userRepository : data.UserRepository;
        private projectRepository : data.ProjectRepository;

        constructor(userRepository : data.UserRepository, projectRepository : data.ProjectRepository) {
            this.userRepository = userRepository;
            this.projectRepository = projectRepository;
        }

        public forUser(details:model.UserLogin, username:string):Q.IPromise<service.AuthorisationResult> {
            return this.userRepository.getUser(username).then((user: model.db.User) => {
                if (!user)
                    return AuthorisationResult.NotFound;

                if (details.authLevel >= model.AuthenticationLevel.Super || details.id == user.id)
                    return AuthorisationResult.Success;

                return AuthorisationResult.Failure;
            });
        }

        public forProject(details:model.UserLogin, projectname:string):Q.IPromise<service.AuthorisationResult> {
            return this.projectRepository.getProject(projectname).then((project: model.db.Project) => {
                if (!project)
                    return AuthorisationResult.NotFound;

                if (details.authLevel >= model.AuthenticationLevel.Super || details.id == project.userId)
                    return AuthorisationResult.Success;

                return AuthorisationResult.Failure;
            });
        }

    }
}
