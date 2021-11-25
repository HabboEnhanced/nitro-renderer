import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class LoginWithPasswordComposer implements IMessageComposer<ConstructorParameters<typeof LoginWithPasswordComposer>>
{
    private _data: ConstructorParameters<typeof LoginWithPasswordComposer>;

    constructor(email: string, password: string, int1: number, int2: number)
    {
        this._data = [ email, password, 0, 0 ];
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