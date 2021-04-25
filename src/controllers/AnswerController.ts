import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import SurveyUserRepository from '../repositories/SurveyUserRepository';
import AppErrors from '../errors/AppErrors';

class AnswerController {

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveysUsersRepository.findOne({ id: String(u) });

    if (!surveyUser) {
      throw new AppErrors('The survey user does not exist.');
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.status(200).json(surveyUser);
  }

}

export default AnswerController;
