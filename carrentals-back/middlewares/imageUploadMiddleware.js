const multer = require("multer");
const path = require("path");
const { uploadToS3 } = require("../aws/s3.js");
const companyModel = require("../models/companiesModel.js");


const rootPath = path.resolve()
const uploadPath = path.join(rootPath, "public", "assets", "uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            return cb(null, true);
        }
        cb("Error: JPG file only");
    },
}).single("image");

const fileUploadMiddleWare = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            res.status(400).send(JSON.stringify({ error: err.message }));
        } else if (err) {
            next(new Error(err));
        }
        try {
            const company_id = req.params.company_id;
            const vehicle_id = req.params.vehicle_id;
            const result = await uploadToS3(req.file);
            const dbResult = await companyModel.updateOne(
                { _id: company_id, "vehicles._id": vehicle_id },
                { $addToSet: { "vehicles.$.images": `/images/${result?.key}` } }
            );
            res.json({ success: true, results: dbResult })
        } catch (e) {
            next(e);
        }
    });
};

module.exports = fileUploadMiddleWare;
