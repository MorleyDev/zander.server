module data.impl {
    var Q = require('q');
    
    export class ApplicationRepositoryImpl implements ApplicationRepository {
        
        private pkgInfo: any;
            
        constructor() {
            this.pkgInfo = { exports: { } }; 
            require('pkginfo')(this.pkgInfo);
        }
        
        public version() : Q.IPromise<string> {
            return Q(this.pkgInfo.exports.version);
        }
    }
}
