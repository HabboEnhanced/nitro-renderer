import { IMessageEvent, MessageEvent } from '../../../../../../core';
import { FurnitureListParser } from '../../../parser/inventory/furniture/FurnitureListParser';

export class FurnitureListEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurnitureListParser);
    }

    public getParser(): FurnitureListParser
    {
        return this.parser as FurnitureListParser;
    }
}
