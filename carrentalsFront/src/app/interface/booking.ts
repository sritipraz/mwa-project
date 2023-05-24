export interface IBooking {
    user_name: string,
    user_email: string,
    booking_date: {
        start: Date,
        end: Date
    }
}