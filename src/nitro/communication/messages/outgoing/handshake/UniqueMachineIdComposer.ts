import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class UniqueMachineIdComposer implements IMessageComposer<ConstructorParameters<typeof UniqueMachineIdComposer>>
{
    private _data: ConstructorParameters<typeof UniqueMachineIdComposer>;

    constructor(machineId: string, str1: string, browser: string, str2: string)
    {
        this._data = [ machineId, str1, browser, str2 ];
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