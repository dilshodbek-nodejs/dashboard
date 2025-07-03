import { Router } from 'express';
import { getProfile, saveQuizResult, updateProfile, updateProfileAvatar, getAllRanks } from '../controllers/profile.controller';
import { authenticateJWT } from '../middleware/auth';
import { upload } from '../middleware/multer';

const router = Router();

router.get('/me', authenticateJWT, getProfile);
router.post('/quiz', authenticateJWT, saveQuizResult);
router.put('/me', authenticateJWT, updateProfile);
router.post('/me/avatar', authenticateJWT, upload.single('avatar'), updateProfileAvatar);
router.get('/ranks', getAllRanks);

export default router; 