import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction, Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import cors from 'cors';
import passportConfig from './config/passportConfig';

import googleRouter from './routes/googleRoutes'
import usersRouter from './routes/usersRoutes';
import indexRouter from './routes/indexRoutes';
import connectDB from './config/dbConfig';

dotenv.config();
connectDB();
const app: Application = express();

app.use(cors());


app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY!],
  }),
);

app.use(passportConfig.initialize());
app.use(passportConfig.session());

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));


app.use('/auth', googleRouter);
app.use('/', indexRouter);
app.use('/bkeep/users', usersRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
