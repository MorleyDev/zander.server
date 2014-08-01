/// <reference path='../data/ProjectRepository.ts' />
/// <reference path='../model/net/CreateProjectDto.ts' />
/// <reference path='../model/net/UpdateProjectDto.ts' />

module service {
    export class CreateProjectService {
        private projectRepository:data.ProjectRepository;

        constructor(projectRepository:data.ProjectRepository) {
            this.projectRepository = projectRepository;
        }

        public forUser(user:model.LoggedInUserDetails, createProject:model.net.CreateProjectDto):Q.IPromise<model.db.Project> {
            return this.projectRepository.getProject(createProject.name)
                .then((project:model.db.Project) => {
                    if (project)
                        return undefined;

                    return this.projectRepository.createProject(user.id, createProject.name, createProject.git)
                        .then((project:model.db.Project) => {
                            return project;
                        });
                });
        }
    }

    export class GetProjectService {
        private projectRepository:data.ProjectRepository;

        constructor(projectRepository:data.ProjectRepository) {
            this.projectRepository = projectRepository;
        }

        public byName(name:string):Q.IPromise<model.db.Project> {
            return this.projectRepository.getProject(name);
        }
    }

    export class UpdateProjectService {
        private projectRepository:data.ProjectRepository;

        constructor(projectRepository:data.ProjectRepository) {
            this.projectRepository = projectRepository;
        }

        public byName(name:string, dto:model.net.UpdateProjectDto):Q.IPromise<model.db.Project> {
            return this.projectRepository.updateProject(name, dto.git)
                .then(() => {
                    return this.projectRepository.getProject(name);
                });
        }
    }

    export class DeleteProjectService {
        private projectRepository:data.ProjectRepository;

        constructor(projectRepository:data.ProjectRepository) {
            this.projectRepository = projectRepository;
        }

        public byName(name:string):Q.IPromise<void> {
            return this.projectRepository.deleteProject(name);
        }

        public forUser(userId:string):Q.IPromise<void> {
            return this.projectRepository.deleteUsersProjects(userId);
        }
    }
}