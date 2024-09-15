import {NextFunction, Response} from 'express';
import jwt from 'jsonwebtoken';
import wrapAsync from "./wrapAsync";
import {ExtendedRequest} from "../types/custom";

const verifyToken = wrapAsync(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({error: 'No token provided'});
        return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {id: string};
    req.userId = decodedToken.id

    next();
});

export default verifyToken;



