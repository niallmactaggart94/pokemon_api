import { Knex } from 'knex';
import { Context, Next } from 'koa';
import { getDb } from '../interfaces/db/dbSetup';
import Transaction = Knex.Transaction;

type InjectTransactionFn = (ctx: Context, next: Next, trx: Transaction) => Promise<void>;

const handlerWithTransaction = (inputHandler: InjectTransactionFn) => {
  const handler = async (ctx: Context, next: Next) => {
    return getDb().transaction(async (trx) => {
      return inputHandler(ctx, next, trx);
    });
  };
  return handler;
};

export default handlerWithTransaction;
