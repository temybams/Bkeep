import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { generateToken, setTokenCookie } from "../utils/tokenGeneration";


export const signup = async (req: Request, res: Response) => {
    try {
        const { Name, Email, Password } = req.body;
        if (await User.findOne({ Email }))
            return res.status(400).json({ message: 'Usre already exists' });
        if (req.body.PhoneNumber.startsWith('+234')) {
            req.body.PhoneNumber = req.body.PhoneNumber.replace('+234', '0');
        }

        const normalisedEmail = Email.toLowerCase();
        const newUser = await User.create({
            Name,
            Email: normalisedEmail,
            Password,
            PhoneNumber: req.body.PhoneNumber,
        });

        if (!newUser) return res.status(400).json({ message: 'Failed to create user' })
        if (newUser) {
            return res.status(200).json({ message: 'user created successfully' })
        } else {
            res.status(500).json({ message: 'Error creating user' })
        }
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating user', error: error.message })
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { Email, Password } = req.body;
        const normalisedEmail = Email.toLowerCase();
        const user = await User.findOne({ Email: normalisedEmail });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        if (!user.Password) return res.status(400).json({ message: 'User signed with Google' });
        if (user && (await user.matchPassword(Password))) {
            const token = generateToken(user._id);
            setTokenCookie(res, token);
            return res
                .status(200)
                .json({ message: 'Logged in succefully', Name: user.Name, token });
        }
        return res.status(400).json({ message: 'Invalid credentials' });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}


export const authCheck = async (req: Request, res: Response) => {
    try {
      res.status(200).json({ message: 'User is authenticated' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };


export const signout = async (req: Request, res: Response) => {
    try {
      res.setHeader('Set-Cookie', `jwt=; HttpOnly; Max-Age=${0}; Path=/`);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  