module model {
    export class ConfigurationGodUser {
        public name : string;
        public password : string;
    }

    export class Configuration {
        public port : number;
        public host : string;
        public goduser : ConfigurationGodUser;
        public hashAlgorithm : string;
        public throttle : any;
        public mysql : any;
        public sqlite : string;
    }
}
