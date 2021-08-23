﻿import { IMessageDataWrapper, IMessageParser } from '../../../../../../core';

export class BotRemovedFromInventoryParser implements IMessageParser
{
    private _itemId: number;

    public flush(): boolean
    {
        this._itemId = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._itemId = wrapper.readInt();

        return true;
    }

    public get itemId(): number
    {
        return this._itemId;
    }
}
