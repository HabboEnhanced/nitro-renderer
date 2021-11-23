import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class InitDhHandshakeComposer implements IMessageComposer<ConstructorParameters<typeof InitDhHandshakeComposer>>
{
    private _data: ConstructorParameters<typeof InitDhHandshakeComposer>;

    constructor()
    {
        this._data = [];
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