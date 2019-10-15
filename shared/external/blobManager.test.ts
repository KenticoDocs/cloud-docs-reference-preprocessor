import { Operation } from 'kontent-docs-shared-code/reference/preprocessedModels';

import { getBlobId } from './blobManager';

describe('getBlobId', () => {
  it('returns correct blob id for initialize operation', () => {
    const codename: string = 'content_management_api';
    const operation: Operation = Operation.Initialize;
    const expectedResult: string = codename;

    const actualResult: string = getBlobId(codename, operation);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns correct blob id for update operation', () => {
    const codename: string = 'content_management_api';
    const operation: Operation = Operation.Update;
    const expectedResult: string = codename;

    const actualResult: string = getBlobId(codename, operation);

    expect(actualResult).toEqual(expectedResult);
  });

  it('returns correct blob id for preview operation', () => {
    const codename: string = 'content_management_api';
    const operation: Operation = Operation.Preview;
    const expectedResult: string = `${codename}-preview`;

    const actualResult: string = getBlobId(codename, operation);

    expect(actualResult).toEqual(expectedResult);
  });

  it('throws for unknown operation', () => {
    const codename: string = 'content_management_api';
    const operation: any = 'Unknown';

    expect(() => getBlobId(codename, operation)).toThrow();
  });
});
