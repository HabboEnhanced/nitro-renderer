import { IMessageEvent } from '../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../core/communication/messages/MessageEvent';
import { MarketplaceBuyOfferResultParser } from '../../parser';

export class MarketplaceBuyOfferResultEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, MarketplaceBuyOfferResultParser);
    }

    public getParser(): MarketplaceBuyOfferResultParser
    {
        return this.parser as MarketplaceBuyOfferResultParser;
    }
}
