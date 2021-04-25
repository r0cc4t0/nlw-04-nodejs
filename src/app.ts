import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import createConnection from './database';
import routes from './routes';
import AppErrors from './errors/AppErrors';

createConnection();
const app = express();

app.use(express.json());
app.use(routes);
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof AppErrors) {
    return response.status(err.statusCode).json({ message: err.message });
  }
  return response.status(500).json({
    status: 'Error',
    message: `Internal Server Error ${err.message}`
  });
});

export default app;
