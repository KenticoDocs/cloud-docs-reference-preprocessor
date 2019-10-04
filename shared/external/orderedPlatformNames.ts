import {getDeliveryClient} from './kenticoCloudClient';

export let orderedPlatformNames: string[] = [];

export const fetchOrderedPlatformNames = async (): Promise<void> => {
    const platformPicker = await getDeliveryClient()
        .item('platform_picker')
        .toPromise();

    orderedPlatformNames = platformPicker.item.options.itemCodenames;
};
