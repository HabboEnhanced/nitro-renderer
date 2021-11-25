import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class LoginWithTicketComposer implements IMessageComposer<ConstructorParameters<typeof LoginWithTicketComposer>>
{
    private _data: ConstructorParameters<typeof LoginWithTicketComposer>;

    constructor(ticket: string, time: number)
    {
        this._data = [ ticket, 0 ];
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