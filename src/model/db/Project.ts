module model.db {
    export class Project {
        public id:string;
        public userId:string;
        public name:string;
        public git:string;
        public timestamp:number;
    }
}