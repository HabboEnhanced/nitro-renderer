import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';
import { ModeratorInitData } from './utils/ModeratorInitData';

export class ModtoolMainParser  implements IMessageParser
{
    private _data: ModeratorInitData = null;
    public flush(): boolean
    {
        this._data = null;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        this._data = new ModeratorInitData(wrapper);
        return true;
    }

    public get data(): ModeratorInitData
    {
        return this._data;
    }
}
