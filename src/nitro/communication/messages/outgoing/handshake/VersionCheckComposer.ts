import { NitroVersion } from '../../../../../core';
import { ClientDeviceCategoryEnum } from '../../../../../core/communication/connections/enums/ClientDeviceCategoryEnum';
import { ClientPlatformEnum } from '../../../../../core/communication/connections/enums/ClientPlatformEnum';
import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class VersionCheckComposer implements IMessageComposer<ConstructorParameters<typeof VersionCheckComposer>>
{
    private _data: ConstructorParameters<typeof VersionCheckComposer>;

    constructor(int1: number, version: string, str: string)
    {
        this._data = [ int1, version, str ];
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
