import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class CompleteDhHandshakeMessageComposer implements IMessageComposer<ConstructorParameters<typeof CompleteDhHandshakeMessageComposer>>
{
    private _data: ConstructorParameters<typeof CompleteDhHandshakeMessageComposer>;

    constructor(clientPublicKey: string)
    {
        this._data = [ clientPublicKey ];
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