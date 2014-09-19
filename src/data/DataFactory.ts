module data {
    export class DataFactory {
        constructor(configuration:model.Configuration, database:any) {
            this.project = new data.impl.ProjectRepositoryImpl(database);
            this.user = new data.impl.UserRepositoryImpl(configuration.hashAlgorithm, database);
            this.application = new data.impl.ApplicationRepositoryImpl();
            this.authenticate = new data.impl.BasicAuthenticateUser(configuration, this.user);
        }

        public project:data.ProjectRepository;
        public user:data.UserRepository;
        public application: data.ApplicationRepository;
        public authenticate:data.AuthenticateUser;
    }
}
