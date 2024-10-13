import {Router, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import wrapAsync from "../utils/wrapAsync";

const router = Router();

router.post('/register', wrapAsync(async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const userExists = await User.findOne({username});
    if (userExists) {
        res.status(400).json({message: 'User already exists'});
        return;
    }

    const newUser = new User({username, password});
    await newUser.save();

    const token = jwt.sign({
        id: newUser._id,
        username: newUser.username
    }, process.env.JWT_SECRET || 'secret', {expiresIn: '1h'});
    res.status(201).json({token});
}));


router.post('/login', wrapAsync(async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (!user) {
        res.status(400).json({message: 'Invalid credentials'});
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
        res.status(400).json({message: 'Invalid credentials'});
        return;
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET || 'secret', {expiresIn: '1h'});

    res.status(200).json({token});
}));

export default router;
