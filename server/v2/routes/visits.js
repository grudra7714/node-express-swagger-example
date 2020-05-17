import express from 'express';
import {validators} from "../validators/index";
import VisitController from "../api/controllers/VisitController";

const visitController = new VisitController();

var router = express.Router();

router.get('/', validators["visit"]["GET"], visitController.get);
router.post('/', validators["visit"]["POST"], visitController.post);

export default router;
