import { IMessageEvent, MessageEvent } from '../../../../../core';
import { PurchaseErrorMessageParser } from '../../parser';

export class PurchaseErrorMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, PurchaseErrorMessageParser);
    }

    public getParser(): PurchaseErrorMessageParser
    {
        return this.parser as PurchaseErrorMessageParser;
    }
}
