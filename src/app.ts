import express, {Request, Response} from 'express';
import logger from 'morgan';
import indexRouter from './routes/index';
import userRouter from './routes/user';
import cookieParser from 'cookie-parser';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', userRouter);

app.use((req: Request, res: Response) => {
    res.status(404).send('Not Found');
});

app.use((err: any, req: Request, res: Response) => {
    res.status(err.status || 500);
    res.json({error: err.message});
});

export default app;