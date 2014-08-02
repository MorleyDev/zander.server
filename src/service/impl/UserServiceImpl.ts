module service.impl {
    export class CreateUserServiceImpl implements CreateUserService {
        private userRepository:data.UserRepository;

        constructor(userRepository:data.UserRepository) {
            this.userRepository = userRepository;
        }

        public fromDto(dto:model.net.CreateUserDto):Q.IPromise<model.db.User> {
            return this.userRepository.getUser(dto.username)
                .then((user:model.db.User) => {
                    if (user)
                        return undefined;

                    return this.userRepository.createUser(dto.username, dto.email, dto.password);
                });
        }
    }

    export class UpdateUserServiceImpl implements UpdateUserService {
        private userRepository:data.UserRepository;

        constructor(userRepository:data.UserRepository) {
            this.userRepository = userRepository;
        }

        public withUsername(username:string, dto:model.net.UpdateUserDto):Q.IPromise<model.db.User> {
            return this.userRepository.getUser(username)
                .then((user:model.db.User):Q.IPromise<model.db.User> => {
                    if (!user)
                        return undefined;

                    return this.userRepository.updateUser(user.id, dto.email, dto.password).then(() => {
                        return this.userRepository.getUser(username);
                    });
                });
        }
    }

    export class GetUserServiceImpl implements GetUserService {
        private userRepository:data.UserRepository;

        constructor(userRepository:data.UserRepository) {
            this.userRepository = userRepository;
        }

        public byUsername(username:string):Q.IPromise<model.db.User> {
            return this.userRepository.getUser(username);
        }
    }

    export class DeleteUserServiceImpl implements DeleteUserService {
        private userRepository:data.UserRepository;
        private projectRepository:data.ProjectRepository;

        constructor(userRepository:data.UserRepository, projectRepository:data.ProjectRepository) {
            this.userRepository = userRepository;
            this.projectRepository = projectRepository;
        }

        public byUsername(username:string):Q.IPromise<void> {
            return this.userRepository.getUser(username).then((user: model.db.User) => {
                return this.projectRepository.deleteUsersProjects(user.id)
                    .then(() => {
                        return this.userRepository.deleteUser(user.username);
                    });
            });
        }
    }
}
