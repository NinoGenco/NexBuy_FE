export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string
  ) {}

  get displayName(): string {
    return `${this.name} <${this.email}>`;
  }
}
