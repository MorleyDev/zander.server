/// <reference path='../data/UserRepository.ts' />
/// <reference path='../model/net/CreateUserDto.ts' />
/// <reference path='../model/net/UpdateUserDto.ts' />

module service {
    export class CreateUserService {
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

    export class UpdateUserService {
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

    export class GetUserService {
        private userRepository:data.UserRepository;

        constructor(userRepository:data.UserRepository) {
            this.userRepository = userRepository;
        }

        public byUsername(username:string):Q.IPromise<model.db.User> {
            return this.userRepository.getUser(username);
        }
    }

    export class DeleteUserService {
        private userRepository:data.UserRepository;
        private projectRepository:data.ProjectRepository;

        constructor(userRepository:data.UserRepository, projectRepository:data.ProjectRepository) {
            this.userRepository = userRepository;
            this.projectRepository = projectRepository;
        }

        public byUser(user:model.db.User):Q.IPromise<void> {
            return this.projectRepository.deleteUsersProjects(user.id)
                .then(() => {
                    return this.userRepository.deleteUser(user.username);
                });
        }
    }
}

