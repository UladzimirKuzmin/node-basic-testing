// Uncomment the code below and write your tests
import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

function setupMock(instanceMock?: Partial<AxiosInstance>) {
  return {
    get: jest.fn().mockResolvedValueOnce({ data: { a: 1, b: 2 } }),
    ...instanceMock,
  } as unknown as AxiosInstance;
}

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const createSpy = jest.spyOn(axios, 'create').mockReturnValue(setupMock());

    jest.advanceTimersByTime(5000);

    await throttledGetDataFromApi('/posts');
    expect(createSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const getSpy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: {} });

    jest.advanceTimersByTime(5000);

    await throttledGetDataFromApi('/posts');
    expect(getSpy).toHaveBeenCalledWith('/posts');
  });

  test('should return response data', async () => {
    jest.spyOn(axios, 'create').mockReturnValue(setupMock());

    jest.advanceTimersByTime(5000);

    const response = await throttledGetDataFromApi('/posts');
    expect(response).toEqual({ a: 1, b: 2 });
  });
});
