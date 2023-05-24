export interface IAddVehicle {
    _id?: string,
    type: string,
    maker: string,
    make: number,
    model: string,
    seaters: number,
    features: Array<string>,
    description: string,
    images?: Array<string>
}
export interface IVehicle  extends IAddVehicle{
    _id: string,
}