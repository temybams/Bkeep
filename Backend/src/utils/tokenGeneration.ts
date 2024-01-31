import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (userID: string) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });
    return token;
};

export const setTokenCookie = (res:Response, token: string) =>{
    res.setHeader(
        'set-Cookie',
        `jwt=${token}; HttpOnly; Max-Age=${1 * 24 * 60 * 60}; Path=/`
    )
}