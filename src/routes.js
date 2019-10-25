import express from 'express';

import user from './controllers/user';
import auth from './controllers/auth';

const router = express();

router.use('/user', user());
router.use('/auth', auth());

export default router;