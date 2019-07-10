export interface IKenticoCloudError extends Error {
    readonly errorCode: number,
}

export interface IEventGridEvent {
    readonly id: string;
    readonly topic?: string;
    readonly subject: string;
    readonly data: IEventGridEventData;
    readonly eventType: string;
    readonly eventTime: Date;
    readonly metadataVersion?: string;
    readonly dataVersion: string;
}

export interface IEventGridEventData {
    readonly test: string,
    readonly webhook: {
        readonly items: IWebhookContentItem[],
        readonly taxonomies: unknown,
    }
}

export interface IWebhookContentItem {
    readonly codename: string,
    readonly language: string;
    readonly type: string,
}

export enum Operation {
    Initialize = 'INITIALIZE',
    Update = 'UPDATE',
    Preview = 'PREVIEW',
}
