
import express, { Request, Response } from 'express';
import passport from 'passport';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import { generateToken, setTokenCookie } from '../utils/tokenGeneration';
// import authCheck from '../middleware/googleAuth';
import {
    getHome,
    getLogin
} from '../controllers/googleController'
import { clientUrl } from '../config/config';
import User from '../models/userModel';

interface User2 {
    _id: string;
}

dotenv.config();

const router = express.Router();

router.get('/', getHome);

router.get('/login', getLogin);

// router.get('/profile', authCheck, getProfile);

router.get('/google', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    passport.authenticate('google', {
        scope: ['email', 'profile'],
    })(req, res, next);
});

router.get(
    '/google/redirect',
    passport.authenticate('google'),
    (req: Request, res: Response) => {
        const token = generateToken((req.user as User2)._id);
        const tokenEncrypt = CryptoJS.AES.encrypt(
            token,
            process.env.HASH_SECRET!,
        ).toString();
        const tokenEncoded = encodeURIComponent(tokenEncrypt);
        res.redirect(
            `${clientUrl}/dashboard?stuff='............................................................................................................................................................................................................................................................................'&page=${tokenEncoded}`,
        );
    },
);

router.post('/google/callback', async (req: Request, res: Response) => {
    console.log(req.body)
    const currentUser = await User.findOne({
        Email: req.body.email,
    });
    if (currentUser) {
        const token = generateToken(currentUser._id);
        setTokenCookie(res, token);
        return res.status(200).json({
            message: 'Logged in successfully',
            Name: currentUser.Name,
            token,
        });
    } else {
        console.log(req.body);
        new User({
            Name: req.body.name,
            Email: req.body.email,
            GoogleID: req.body.id,
            ProfilePhoto: req.body.picture,
            isVerified: true,
        })
            .save({ validateBeforeSave: false })
            .then((newUser) => {
                const token = generateToken(newUser._id);
                setTokenCookie(res, token);
                return res.status(200).json({
                    message: 'Logged in successfully',
                    Name: newUser.Name,
                    token,
                });
            });
    }
});

export default router;
