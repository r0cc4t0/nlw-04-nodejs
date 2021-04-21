import { Router } from 'express';
import UserController from './controllers/UserController';
import SurveyController from './controllers/SurveyController';
import SendMailController from './controllers/SendMailController';
import AnswerController from './controllers/AnswerController';

const routes = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();

routes.get('/users', userController.show);
routes.post('/users', userController.create);

routes.get('/surveys', surveyController.show);
routes.post('/surveys', surveyController.create);

routes.post('/sendmail', sendMailController.execute);

routes.get('/answers/:value', answerController.execute);

export default routes;
