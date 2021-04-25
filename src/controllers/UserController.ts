import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import UserRepository from '../repositories/UserRepository';
import AppErrors from '../errors/AppErrors';

class UserController {

  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    }
    catch (err) {
      throw new AppErrors(err);
    }

    const usersRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (userAlreadyExists) {
      throw new AppErrors('User already exists!');
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }

  async show(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UserRepository);

    const users = await usersRepository.find();

    return response.json(users);
  }

}

export default UserController;
