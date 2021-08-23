import { IMessageEvent, MessageEvent } from '../../../../../../core';
import { RoomScoreParser } from '../../../parser/room/data/RoomScoreParser';

export class RoomScoreEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomScoreParser);
    }

    public getParser(): RoomScoreParser
    {
        return this.parser as RoomScoreParser;
    }
}
