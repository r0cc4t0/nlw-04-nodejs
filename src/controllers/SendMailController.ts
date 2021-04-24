import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import * as yup from 'yup';
import UserRepository from '../repositories/UserRepository';
import SurveyRepository from '../repositories/SurveyRepository';
import SurveyUserRepository from '../repositories/SurveyUserRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {

  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const schema = yup.object().shape({
      email: yup.string().email().required(),
      survey_id: yup.string().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    }
    catch (err) {
      return response.status(400).json({ error: err });
    }

    const usersRepository = getCustomRepository(UserRepository);
    const surveysRepository = getCustomRepository(SurveyRepository);
    const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

    const user = await usersRepository.findOne({ email });
    if (!user) {
      return response.status(400).json({ error: 'The user does not exist.' });
    }

    const survey = await surveysRepository.findOne({ id: survey_id });
    if (!survey) {
      return response.status(400).json({ error: 'The survey does not exist.' });
    }

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: process.env.URL_MAIL
    };

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey']
    });

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.status(201).json(surveyUser);
  }

}

export default SendMailController;
