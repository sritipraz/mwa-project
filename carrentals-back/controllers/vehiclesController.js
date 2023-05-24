const companyModel = require("../models/companiesModel");
const mongoose = require('mongoose');

module.exports.getAllVehicles = async (req, res, next) => {
    try {
        const { company_id } = req.params;
        const { type } = req.query;
        const query = type ? { "vehicles.type": type } : {};
        const results = await companyModel.aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(company_id) } },
            { $unwind: "$vehicles" },
            { $match: query },
            { $group: { "_id": "$_id", "vehicles": { $push: "$vehicles" } } },
            { $project: { vehicles: "$vehicles", _id: 0 } },
            { $unwind: "$vehicles" },
            { $project: { 
                _id: "$vehicles._id",
                type: "$vehicles.type",
                maker: "$vehicles.maker",
                make: "$vehicles.make",
                model: "$vehicles.model",
                seaters: "$vehicles.seaters",
                description: "$vehicles.description",
                features: "$vehicles.features",
                images: "$vehicles.images",
             } }

        ])
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}

module.exports.getVehicleById = async (req, res, next) => {
    try {
        const { company_id, vehicle_id } = req.params;
        const results = await companyModel.findOne({ _id: company_id, "vehicles._id": vehicle_id }, { "vehicles.$": 1, _id: 0 });
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}
module.exports.getVehicleByCompanyAndType = async (req, res, next) => {
    try {
        const results = await companyModel.aggregate([{ $unwind: "$vehicles" }, { $group: { _id: { _id: "$_id", company: "$name", type: "$vehicles.type" }, count: { $sum: 1 } } }, { $project: { _id: "$_id._id", company: "$_id.company", type: "$_id.type", count: "$count" } }])
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}


module.exports.addVehicle = async (req, res, next) => {
    try {
        const { company_id } = req.params;
        const newVehicle = req.body;
        newVehicle.type = newVehicle.type.toLowerCase();
        const results = await companyModel.findOneAndUpdate(
            { _id: company_id },
            { $push: { vehicles: newVehicle } },
            { new: true }
        );
        const index = results.vehicles.length - 1;
        res.json({ success: true, results: results.vehicles[index] });
    } catch (error) {
        next(error);
    }
}
module.exports.updateVehicle = async (req, res, next) => {
    try {
        const { company_id, vehicle_id } = req.params;
        const { type, maker, make, model, seaters, description, features } = req.body;
        const results = await companyModel.updateOne(
            { _id: company_id, "vehicles._id": vehicle_id },
            {
                $set: {
                    "vehicles.$.type": type,
                    "vehicles.$.maker": maker,
                    "vehicles.$.make": make,
                    "vehicles.$.model": model,
                    "vehicles.$.seaters": seaters,
                    "vehicles.$.description": description,
                    "vehicles.$.features": features
                }
            }
        );
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}
module.exports.deleteVehicle = async (req, res, next) => {
    try {
        const { company_id, vehicle_id } = req.params;
        const results = await companyModel.updateOne(
            { _id: company_id },
            { $pull: { vehicles: { _id: vehicle_id } } }
        );
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}
