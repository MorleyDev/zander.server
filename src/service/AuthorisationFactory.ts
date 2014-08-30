module service {
    export class AuthorisationFactory {
        private authorisers:any;

        public constructor(dataFactory : data.DataFactory) {
            this.authorisers = {
                "project": new impl.ProjectAuthorisationServiceImpl(dataFactory.project),
                "user": new impl.UserAuthorisationServiceImpl(dataFactory.user)
            };
        }

        public get(type:string):AuthorisationService {
            var authoriser = this.authorisers[type];
            if (!authoriser)
                throw "Unrecognised Authoriser " + type;

            return authoriser;
        }
    }
}
