import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
export default class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, current) => total + current.value, 0);
    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((total, current) => total + current.value, 0);
    const total = income - outcome;
    const balance = { income, outcome, total };
    return balance;
  }
}
