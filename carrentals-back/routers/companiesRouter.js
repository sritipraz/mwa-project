const express = require('express');
const router = express.Router();
const { getAllCompanies, getCompanyById, addCompany, updateCompany, deleteCompany, getCompaniesCount } = require('../controllers/companiesController');
const { getAllVehicles, getVehicleById, addVehicle, updateVehicle, deleteVehicle, getVehiclesCounts, getVehicleByCompanyAndType } = require('../controllers/vehiclesController');
const { addAppointment } = require('../controllers/appointmentController');
const { checkToken } = require('../middlewares/checkToken');
const fileUploadMiddleWare = require('../middlewares/imageUploadMiddleware');


router.get('/', getAllCompanies);
router.get('/count', checkToken, getCompaniesCount);
router.get('/vehicles/count', checkToken, getVehicleByCompanyAndType)
router.get('/:company_id', getCompanyById);
router.post('/', checkToken, addCompany);
router.put('/:company_id', checkToken, updateCompany);
router.delete('/:company_id', checkToken, deleteCompany);


router.get('/:company_id/vehicles', getAllVehicles);
router.get('/:company_id/vehicles/:vehicle_id', getVehicleById);
router.post('/:company_id/vehicles', checkToken, addVehicle);
router.put('/:company_id/vehicles/:vehicle_id', checkToken, updateVehicle);
router.delete('/:company_id/vehicles/:vehicle_id', checkToken, deleteVehicle);

router.post('/:company_id/vehicles/:vehicle_id/appointments', checkToken, addAppointment);

router.post("/:company_id/vehicles/:vehicle_id/upload",checkToken,fileUploadMiddleWare);

module.exports = router;