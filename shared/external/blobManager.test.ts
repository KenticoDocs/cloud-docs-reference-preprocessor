import { getBlobId } from './blobManager';
import { Operation } from './models';

describe('getBlobId', () => {
    it('returns correct blob id for initialize operation', () => {
        const codename = 'content_management_api';
        const operation = Operation.Initialize;
        const expectedResult = codename;

        const actualResult = getBlobId(codename, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns correct blob id for update operation', () => {
        const codename = 'content_management_api';
        const operation = Operation.Update;
        const expectedResult = codename;

        const actualResult = getBlobId(codename, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns correct blob id for preview operation', () => {
        const codename = 'content_management_api';
        const operation = Operation.Preview;
        const expectedResult = `${codename}-preview`;

        const actualResult = getBlobId(codename, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('throws for unknown operation', () => {
        const codename = 'content_management_api';
        const operation = 'Unknown';

        expect(() => getBlobId(codename, operation as Operation)).toThrow();
    });
});
