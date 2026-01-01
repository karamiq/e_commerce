export default interface ActiveUserData {
    sub: string;
    roleId?: string;
    iat: number;
    exp: number;
}