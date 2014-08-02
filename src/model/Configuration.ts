module model {
    export class Configuration {
        public port:number;
        public host:string;
        public goduser:UserPasswordPair;
        public hashAlgorithm:string;
        public throttle:any;
        public mysql:any;
        public sqlite:string;
    }
}
