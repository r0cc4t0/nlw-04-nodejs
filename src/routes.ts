import { Router } from 'express';
import UserController from './controllers/UserController';
import SurveyController from './controllers/SurveyController';

const routes = Router();

const userController = new UserController();
const surveyController = new SurveyController();

routes.get('/users', userController.show);
routes.post('/users', userController.create);

routes.get('/surveys', surveyController.show);
routes.post('/surveys', surveyController.create);

export default routes;
