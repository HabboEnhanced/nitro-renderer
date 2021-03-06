import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { ObjectData } from '../../../incoming/room/engine/ObjectData';
import { FurnitureDataParser } from '../furniture/FurnitureDataParser';

export class ObjectsDataUpdateParser implements IMessageParser
{
    private _objects: ObjectData[];

    public flush(): boolean
    {
        this._objects = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        let totalObjects = wrapper.readInt();

        while(totalObjects > 0)
        {
            const id        = wrapper.readInt();
            const stuffData = FurnitureDataParser.parseObjectData(wrapper);
            const state     = parseFloat(stuffData.getLegacyString());

            this._objects.push(new ObjectData(id, state, stuffData));

            totalObjects--;
        }

        return true;
    }

    public get objects(): ObjectData[]
    {
        return this._objects;
    }
}
