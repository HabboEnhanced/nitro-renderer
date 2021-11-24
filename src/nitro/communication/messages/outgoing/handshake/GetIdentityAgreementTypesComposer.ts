import { IMessageComposer } from '../../../../../core/communication/messages/IMessageComposer';

export class GetIdentityAgreementTypesComposer implements IMessageComposer<ConstructorParameters<typeof GetIdentityAgreementTypesComposer>>
{
    private _data: ConstructorParameters<typeof GetIdentityAgreementTypesComposer>;

    constructor()
    {
        this._data = [];
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