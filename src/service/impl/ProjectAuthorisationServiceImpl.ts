module service.impl {
    export class ProjectAuthorisationServiceImpl implements AuthorisationService {

        private projectRepository : data.ProjectRepository;

        constructor(projectRepository : data.ProjectRepository) {
            this.projectRepository = projectRepository;
        }

        public authenticate(details:model.UserLogin, target:string):Q.IPromise<service.AuthorisationResult> {
            return this.projectRepository.getProject(target).then((project: model.db.Project) => {
                if (!project)
                    return AuthorisationResult.NotFound;

                if (details.authLevel >= model.AuthenticationLevel.Super || details.id == project.userId)
                    return AuthorisationResult.Success;

                return AuthorisationResult.Failure;
            });
        }
    }
}
