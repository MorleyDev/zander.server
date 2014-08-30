module service.impl {
    export class UserAuthorisationServiceImpl implements AuthorisationService {

        private userRepository : data.UserRepository;

        constructor(userRepository : data.UserRepository) {
            this.userRepository = userRepository;
        }

        public authenticate(details:model.UserLogin, target:string):Q.IPromise<service.AuthorisationResult> {
            return this.userRepository.getUser(target).then((user: model.db.User) => {
                if (!user)
                    return AuthorisationResult.NotFound;

                if (details.authLevel >= model.AuthenticationLevel.Super || details.id == user.id)
                    return AuthorisationResult.Success;

                return AuthorisationResult.NotFound;
            });
        }
    }
}
