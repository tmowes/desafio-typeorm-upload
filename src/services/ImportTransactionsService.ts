import fs from 'fs';
import csv from 'csvtojson';
import path from 'path';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

export default class ImportTransactionsService {
  async execute(file: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const filePath = path.join(uploadConfig.directory, file);
    const transactions = await csv().fromFile(filePath);
    async function processTransactions(
      transactionArray: RequestDTO[],
    ): Promise<void> {
      for (const transaction of transactionArray) {
        const { title, type, value, category } = transaction;
        await createTransaction.execute({
          title,
          type,
          value,
          category,
        });
      }
    }
    await processTransactions(transactions);
    const csvFileExists = await fs.promises.stat(filePath);
    if (csvFileExists) {
      await fs.promises.unlink(filePath);
    }
    return transactions;
  }
}
