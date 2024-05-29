import { createErrorResult, createSuccessResult } from '../../../src/utils/Result';

describe('Test Result', () => {
  it('GIVEN success result WHEN ifSuccess THEN call action', async () => {
    // GIVEN
    const result = createSuccessResult('Test');
    const action = jest.fn();

    // WHEN
    result.ifSuccess(action);

    // THEN
    expect(action).toBeCalledWith('Test');
  });

  it('GIVEN error result WHEN ifSuccess THEN not call action', async () => {
    // GIVEN
    const result = createErrorResult('Error');
    const action = jest.fn();

    // WHEN
    result.ifSuccess(action);

    // THEN
    expect(action).not.toBeCalled();
  });

  it('GIVEN success result WHEN ifError THEN not call action', async () => {
    // GIVEN
    const result = createSuccessResult('Test');
    const action = jest.fn();

    // WHEN
    result.ifError(action);

    // THEN
    expect(action).not.toBeCalled();
  });

  it('GIVEN error result WHEN ifError THEN call action', async () => {
    // GIVEN
    const result = createErrorResult('Error');
    const action = jest.fn();

    // WHEN
    result.ifError(action);

    // THEN
    expect(action).toBeCalledWith('Error');
  });
});
