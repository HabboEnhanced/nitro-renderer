import { IMessageEvent, MessageEvent } from '../../../../../../core';
import { RoomFowardParser as RoomForwardParser } from '../../../parser/room/access/RoomFowardParser';

export class RoomForwardEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomForwardParser);
    }

    public getParser(): RoomForwardParser
    {
        return this.parser as RoomForwardParser;
    }
}
