import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class LoginWithTokenComposer implements IMessageComposer<ConstructorParameters<typeof LoginWithTokenComposer>>
{
    private _data: ConstructorParameters<typeof LoginWithTokenComposer>;

    constructor(token: string)
    {
        this._data = [ token ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}