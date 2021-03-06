import { IRoomSession } from '../IRoomSession';
import { RoomSessionEvent } from './RoomSessionEvent';

export class RoomSessionFavouriteGroupUpdateEvent extends RoomSessionEvent
{
    public static FAVOURITE_GROUP_UPDATE: string = 'RSFGUE_FAVOURITE_GROUP_UPDATE';

    private _roomIndex: number;
    private _habboGroupId: number;
    private _habboGroupName: string;
    private _status: number;

    constructor(k: IRoomSession, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: string)
    {
        super(RoomSessionFavouriteGroupUpdateEvent.FAVOURITE_GROUP_UPDATE, k);

        this._roomIndex = _arg_2;
        this._habboGroupId = _arg_3;
        this._habboGroupName = _arg_5;
        this._status = _arg_4;
    }

    public get roomIndex(): number
    {
        return this._roomIndex;
    }

    public get habboGroupId(): number
    {
        return this._habboGroupId;
    }

    public get habboGroupName(): string
    {
        return this._habboGroupName;
    }

    public get status(): number
    {
        return this._status;
    }
}
