import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import SurveyRepository from '../repositories/SurveyRepository';
import SurveyUserRepository from '../repositories/SurveyUserRepository';
import SendMailService from '../services/SendMailService';
import { resolve } from 'path';

class SendMailController {

  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UserRepository);
    const surveysRepository = getCustomRepository(SurveyRepository);
    const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });
    if (!userAlreadyExists) {
      return response.status(400).json({ error: 'The user does not exist.' });
    }

    const surveyAlreadyExists = await surveysRepository.findOne({ id: survey_id });
    if (!surveyAlreadyExists) {
      return response.status(400).json({ error: 'The survey does not exist.' });
    }

    const variables = {
      name: userAlreadyExists.name,
      title: surveyAlreadyExists.title,
      description: surveyAlreadyExists.description,
      user_id: userAlreadyExists.id,
      link: process.env.URL_MAIL
    };

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: userAlreadyExists.id }, { value: null }],
      relations: ['user', 'survey']
    });

    if (surveyUserAlreadyExists) {
      await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath);

    return response.status(201).json(surveyUser);
  }

}

export default SendMailController;
