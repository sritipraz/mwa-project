const companyModel = require("../models/companiesModel");

module.exports.addAppointment = async (req, res, next) => {
    try {
        const { company_id, vehicle_id } = req.params;
        const new_appointment = req.body;
        const results = await companyModel.updateOne(
            { _id: company_id, "vehicles._id": vehicle_id },
            { $push: { "vehicles.$.appointments": new_appointment } }
        );
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}