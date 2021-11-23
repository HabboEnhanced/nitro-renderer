import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';

export class DhInitHandshakeMessageParser implements IMessageParser
{
    private _prime: string;
    private _generator: string;

    public flush(): boolean
    {
        this._prime    = null;
        this._generator   = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._prime    = wrapper.readString();
        this._generator   = wrapper.readString();

        return true;
    }

    public get prime(): string
    {
        return this._prime;
    }

    public get generator(): string
    {
        return this._generator;
    }
}