export class User {

    constructor(
        public username: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public role: string,
    ) {}

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get displayName(): string {
        return `${this.fullName} <${this.email}>`;
    }

}

