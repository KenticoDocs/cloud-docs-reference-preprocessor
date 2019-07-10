interface IKeys {
    readonly azureContainerName: string,
    readonly azureStorageAccountName: string,
    readonly azureStorageKey: string,
    readonly kenticoProjectId: string,
    readonly previewApiKey: string,
    readonly securedApiKey: string,
}

export class Configuration {
    public static keys = {} as IKeys;

    public static set = (isTest: boolean): void => {
        Configuration.keys = {
            azureContainerName: Configuration.getEnvironmentVariable('Azure.ContainerName', isTest),
            azureStorageAccountName: Configuration.getEnvironmentVariable('Azure.StorageAccountName', isTest),
            azureStorageKey: Configuration.getEnvironmentVariable('Azure.StorageKey', isTest),
            kenticoProjectId: Configuration.getEnvironmentVariable('KC.ProjectId', isTest),
            previewApiKey: Configuration.getEnvironmentVariable('KC.PreviewApiKey', isTest),
            securedApiKey: Configuration.getEnvironmentVariable('KC.SecuredApiKey', isTest),
        };
    };

    private static getEnvironmentVariable = (variableName: string, isTest?: boolean): string =>
        process.env[`${variableName}${isTest ? '.Test' : ''}`] || '';
}
