module service.impl {
    export class ApplicationServiceImpl implements ApplicationService {
        private applicationRepository: data.ApplicationRepository;
        
        constructor(applicationRepository: data.ApplicationRepository) {
            this.applicationRepository = applicationRepository;
        }
        
        public getVersion() : Q.IPromise<string> {
            return this.applicationRepository.version();
        }
    }
}
