import { Router } from 'express';
import UserController from './controllers/UserController';
import SurveyController from './controllers/SurveyController';
import SendMailController from './controllers/SendMailController';

const routes = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();

routes.get('/users', userController.show);
routes.post('/users', userController.create);

routes.get('/surveys', surveyController.show);
routes.post('/surveys', surveyController.create);

routes.post('/sendmail', sendMailController.execute);

export default routes;
