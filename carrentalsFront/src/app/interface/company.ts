export interface IAddress {
    city: string,
    state: string,
    zip: string
}
export interface IAddCompany {
    _id?: string,
    name: string,
    location: Array<string>,
    address: IAddress,
    phone: string,
    email: string,
    website: string,
    description: string
}
export interface ICompany  extends IAddCompany{
    _id: string,
}