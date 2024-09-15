import {Request, Response, NextFunction} from "express";
import {Error} from "mongoose";
import {JsonWebTokenError} from "jsonwebtoken";

type AsyncAppFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

function wrapAsync(fn: AsyncAppFunction) {
    return function (req: Request, res: Response, next: NextFunction) {
        fn(req, res, next).catch(error => {
            if (error instanceof Error.StrictModeError) {
                return res.status(400).json({error: "Invalid fields provided."});
            }

            if (error instanceof Error.ValidationError) {
                return res.status(400).json({error: error.message});
            }

            if (error instanceof JsonWebTokenError) {
                res.status(401).json({error: 'Invalid token'});
            }
            next(error);
        });
    }
}

export default wrapAsync;