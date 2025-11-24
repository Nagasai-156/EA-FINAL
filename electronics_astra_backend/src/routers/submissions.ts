import { Router } from 'express';
import { submitSolution, getSubmissionsByProblem } from '../controllers/submissionController';

const router = Router();

router.post('/', submitSolution);
router.get('/problem/:problemId', getSubmissionsByProblem);

export default router;
