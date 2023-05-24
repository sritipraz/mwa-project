const companyModel = require("../models/companiesModel");

module.exports.getAllCompanies = async (req, res, next) => {
    try {
        const { lng, lat, name } = req.query;
        let results;
        if (lng && lat) {
            results = await await companyModel.find({
                location: { $near: [+lng, +lat] }
            });
        } else if (name) {
            results = await companyModel.find({ $text: { $search: name } });
        }
        else {
            results = await companyModel.find();
        }
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}

module.exports.getCompanyById = async (req, res, next) => {
    try {
        const { company_id } = req.params;
        const results = await companyModel.findOne({ _id: company_id });
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}
module.exports.getCompaniesCount = async (req, res, next) => {
    try {
        const results = await companyModel.count();
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}
module.exports.addCompany = async (req, res, next) => {
    try {
        const company = req.body;
        const results = await companyModel.create(company);
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}
module.exports.updateCompany = async (req, res, next) => {
    try {
        const { company_id } = req.params;
        const updated_company = req.body;
        const results = await companyModel.updateOne(
            { _id: company_id },
            { $set: updated_company}
        );
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}
module.exports.deleteCompany = async (req, res, next) => {
    try {
        const { company_id } = req.params;
        const results = await companyModel.deleteOne({ _id: company_id });
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
}