import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import User from '../models/userModel'

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            [, token] = req.headers.authorization.split(' ');
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                    userID: string;
                };
                req.user = decoded.userID;
                const currentUser = await User.findById(req.user);
                if (!currentUser)
                    return res.status(401).json({ message: 'User not found' });
                res.locals.user = currentUser;
                next();
            } catch (error: any) {
                return res.status(401).json({
                    message: 'Not authorised, invalid token',
                    error: error.message,
                });
            }
        } else {
            return res.status(401).json({ message: 'Not authorised, no token' });
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }
};

export const isLoggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.cookies.jwt) {
        try {
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as {
                userID: string;
            };
            req.user =decoded.userID;
            const currentUser =await User.findById(req.user);
            if(!currentUser){
                return res.status(401).json({message: 'user Not found'});
            }
            res.locals.user =currentUser;
            next();
        } catch (error: any) {
            return next();
          }
        } else {
          next();
        }
}