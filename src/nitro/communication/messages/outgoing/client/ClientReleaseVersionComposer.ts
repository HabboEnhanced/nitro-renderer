import { NitroVersion } from '../../../../../core';
import { ClientDeviceCategoryEnum } from '../../../../../core/communication/connections/enums/ClientDeviceCategoryEnum';
import { ClientPlatformEnum } from '../../../../../core/communication/connections/enums/ClientPlatformEnum';
import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class ClientReleaseVersionComposer implements IMessageComposer<ConstructorParameters<typeof ClientReleaseVersionComposer>>
{
    private _data: ConstructorParameters<typeof ClientReleaseVersionComposer>;

    constructor(ivBytes: string, type: string, platform: number, category: number)
    {
        this._data = [ '18C199405558FE3C4534DF9E', 'UNITY2', 4, 3 ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
