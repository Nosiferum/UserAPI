import {Router, Response} from 'express';
import User from '../models/user';
import verifyToken from "../utils/verifyToken";
import wrapAsync from "../utils/wrapAsync";
import {ExtendedRequest} from "../types/custom";

const router = Router();

router.get('/', verifyToken, wrapAsync(async (req: ExtendedRequest, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(404).json({message: 'User not found'});
        return;
    }

    res.status(200).json({message: `You are authorized: ${user.username}`});
}));


export default router;
