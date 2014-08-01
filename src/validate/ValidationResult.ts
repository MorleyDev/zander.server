
module validate {
    export class ValidationResult {

        constructor(success:boolean, reason:string = undefined) {
            this.success = success;
            this.reason = reason;
        }

        public success:boolean;
        public reason:string;
    }
}