import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { DhInitHandshakeMessageParser } from '../../parser/handshake/DhInitHandshakeMessageParser';

export class DhInitHandshakeMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, DhInitHandshakeMessageParser);
    }

    public getParser(): DhInitHandshakeMessageParser
    {
        return this.parser as DhInitHandshakeMessageParser;
    }
}