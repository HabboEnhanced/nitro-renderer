import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { DhCompleteHandshakeMessageParser } from '../../parser/handshake/DhCompleteHandshakeMessageParser';

export class DhCompleteHandshakeMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, DhCompleteHandshakeMessageParser);
    }

    public getParser(): DhCompleteHandshakeMessageParser
    {
        return this.parser as DhCompleteHandshakeMessageParser;
    }
}