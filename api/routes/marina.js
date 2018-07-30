const express = require('express');
const router = express.Router();
const MarinaController = require('../controllers/marina');
const PedestalController = require('../controllers/pedestal');
const BerthController = require('../controllers/berth');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');


router.get('/', isAuth, MarinaController.getMarinas);
router.post('/', isAuth, MarinaController.createMarinas);
router.delete('/:id', MarinaController.remove);
router.get('/:marinaId', MarinaController.getMarina);
router.delete('/:marinaId/pedestals/:id', PedestalController.deleteMarinaPedestals); 
router.get('/:marinaId/pedestals', isAuth, PedestalController.getAllMarinaPedestals);
router.post('/:marinaId/pedestals', isAuth, PedestalController.createMarinaPedestal);
router.get('/:marinaId/utilities', PedestalController.getAllMarinaPedestals);
router.delete('/:marinaId/pedestals/:pedestalId/berths/:id', BerthController.deleteMarinaBerths);
router.get('/:marinaId/pedestals/:pedestalId/berths', isAuth, BerthController.getPedestalBerths);
router.get('/:marinaId/pedestals/:pedestalId/berths/:berthId', isAuth, BerthController.getBerth);
router.get('/:marinaId/pedestals/:pedestalId/berths/:berthId/toggleElectricity', isAuth, BerthController.toggleBerthElectricity);
router.get('/:marinaId/pedestals/:pedestalId/berths/:berthId/toggleWater', isAuth, BerthController.toggleBerthWater);

module.exports = router;