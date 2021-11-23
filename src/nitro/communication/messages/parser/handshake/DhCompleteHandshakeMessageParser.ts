import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';

export class DhCompleteHandshakeMessageParser implements IMessageParser
{
    private _serverPublicKey: string;

    public flush(): boolean
    {
        this._serverPublicKey    = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._serverPublicKey    = wrapper.readString();

        return true;
    }

    public get serverPublicKey(): string
    {
        return this._serverPublicKey;
    }
}