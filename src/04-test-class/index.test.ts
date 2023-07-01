// Uncomment the code below and write your tests
import lodash from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

jest.mock('lodash');

describe('BankAccount', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const account = getBankAccount(10000);
  const accountToTransfer = getBankAccount(0);

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(10000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(11000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(11000, accountToTransfer)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(1000, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    expect(account.deposit(1000).getBalance()).toBe(11000);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(5000).getBalance()).toBe(6000);
  });

  test('should transfer money', () => {
    expect(account.transfer(500, accountToTransfer).getBalance()).toBe(5500);
    expect(accountToTransfer.getBalance()).toBe(500);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockReturnValueOnce(50);
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    account.fetchBalance = jest.fn().mockResolvedValueOnce(25000);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(25000);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    account.fetchBalance = jest.fn().mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
