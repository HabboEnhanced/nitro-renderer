import { IMessageEvent, MessageEvent } from '../../../../../../../core';
import { RoomUnitChatParser } from '../../../../parser/room/unit/chat/RoomUnitChatParser';

export class RoomUnitChatEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomUnitChatParser);
    }

    public getParser(): RoomUnitChatParser
    {
        return this.parser as RoomUnitChatParser;
    }
}
