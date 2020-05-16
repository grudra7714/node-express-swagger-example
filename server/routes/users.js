import express from 'express';
import VisitController from "../api/controllers/VisitController";

const visitController = new VisitController();

var router = express.Router();

/* GET users listing. */
router.get('/', visitController.get);
router.post('/', visitController.post);

export default router;
