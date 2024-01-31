import express from 'express';
import { protect } from '../middleware/protectMiddleware';
import { signin, signup, signout, authCheck } from '../controllers/userController';


const router = express.Router();

router.get('/authcheck', protect, authCheck);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', protect, signout);

export default router;
