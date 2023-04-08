const router = require('express').Router();
const authRouter = require('./api/auth');
const userRouter = require('./api/users');
const postRouter = require('./api/posts');
const profileRouter = require('./api/profile');

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/posts', postRouter);
router.use('/profile', profileRouter);

module.exports = router;