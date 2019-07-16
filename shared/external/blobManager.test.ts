import { ReferenceOperation } from 'cloud-docs-shared-code/reference/preprocessedModels';
import { getBlobId } from './blobManager';

describe('getBlobId', () => {
    it('returns correct blob id for initialize operation', () => {
        const codename = 'content_management_api';
        const operation = ReferenceOperation.Initialize;
        const expectedResult = codename;

        const actualResult = getBlobId(codename, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns correct blob id for update operation', () => {
        const codename = 'content_management_api';
        const operation = ReferenceOperation.Update;
        const expectedResult = codename;

        const actualResult = getBlobId(codename, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns correct blob id for preview operation', () => {
        const codename = 'content_management_api';
        const operation = ReferenceOperation.Preview;
        const expectedResult = `${codename}-preview`;

        const actualResult = getBlobId(codename, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('throws for unknown operation', () => {
        const codename = 'content_management_api';
        const operation = 'Unknown';

        expect(() => getBlobId(codename, operation as ReferenceOperation)).toThrow();
    });
});
