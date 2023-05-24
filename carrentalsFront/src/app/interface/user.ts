export default interface IUser {
    jwt: string;
    user_id: string;
    email: string;
    fullname: string;
    isAdmin: boolean;
    isVerified: boolean;
  }