import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

export default class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // DONE
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    if (type !== 'outcome' && type !== 'income') {
      throw new AppError('Invalid type of transaction', 400);
    }

    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Not enough money.', 400);
    }

    const createCategory = new CreateCategoryService();
    const createdCategory = await createCategory.execute(category);

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: createdCategory.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
    // DONE
  }
}
