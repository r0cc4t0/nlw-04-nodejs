import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import SurveyRepository from '../repositories/SurveyRepository';
import AppErrors from '../errors/AppErrors';

class SurveyController {

  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const schema = yup.object().shape({
      title: yup.string().required(),
      description: yup.string().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    }
    catch (err) {
      throw new AppErrors(err);
    }

    const surveysRepository = getCustomRepository(SurveyRepository);

    const survey = surveysRepository.create({ title, description });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveyRepository);

    const surveys = await surveysRepository.find();

    return response.json(surveys);
  }

}

export default SurveyController;
