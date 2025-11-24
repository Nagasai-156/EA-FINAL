import express from 'express';
import { 
  createProblem, 
  listProblems, 
  getProblemBySlug,
  updateProblem,
  deleteProblem
} from '../controllers/problemController';

const router = express.Router();

router.post('/', createProblem);
router.get('/', listProblems);
router.get('/:slug', getProblemBySlug);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;
