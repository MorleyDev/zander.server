/// <reference path='../model/Configuration.ts' />
/// <reference path='BasicAuthenticateUser.ts' />
/// <reference path='ProjectRepository.ts' />
/// <reference path='UserRepository.ts' />

module data {
    export class DataFactory {
        constructor(configuration:model.Configuration, database:any) {
            this.project = new data.ProjectRepository(database);
            this.user = new data.UserRepository(configuration.hashAlgorithm, database);
            this.authenticate = new data.BasicAuthenticateUser(configuration, this.user);
        }

        public project:data.ProjectRepository;
        public user:data.UserRepository;
        public authenticate:data.BasicAuthenticateUser;
    }
}
