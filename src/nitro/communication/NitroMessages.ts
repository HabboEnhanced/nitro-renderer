import { DhCompleteHandshakeMessageEvent } from './messages/incoming/handshake/DhCompleteHandshakeMessageEvent';
import { CompleteDhHandshakeMessageComposer } from './messages/outgoing/handshake/CompleteDhHandshakeMessageComposer';
import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { DhInitHandshakeMessageEvent } from './messages/incoming/handshake/DhInitHandshakeMessageEvent';
import { IncomingHeader } from './messages/incoming/IncomingHeader';
import { ClientReleaseVersionComposer } from './messages/outgoing/client/ClientReleaseVersionComposer';
import { InitDhHandshakeComposer } from './messages/outgoing/handshake/InitDhHandshakeComposer';
import { GetIdentityAgreementTypesComposer } from './messages/outgoing/handshake/GetIdentityAgreementTypesComposer';
import { OutgoingHeader } from './messages/outgoing/OutgoingHeader';

export class NitroMessages implements IMessageConfiguration
{
    private _events: Map<number, Function>;
    private _composers: Map<number, Function>;

    constructor()
    {
        this._events    = new Map();
        this._composers = new Map();

        this.registerEvents();
        this.registerComposers();
    }

    private registerEvents(): void
    {
        this._events.set(IncomingHeader.DH_INIT_HANDSHAKE, DhInitHandshakeMessageEvent);
        this._events.set(IncomingHeader.DH_COMPLETE_HANDSHAKE, DhCompleteHandshakeMessageEvent);
    }

    private registerComposers(): void
    {
        this._composers.set(OutgoingHeader.RELEASE_VERSION, ClientReleaseVersionComposer);
        this._composers.set(OutgoingHeader.INIT_DH_HANDSHAKE, InitDhHandshakeComposer);
        this._composers.set(OutgoingHeader.COMPLETE_DH_HANDSHAKE, CompleteDhHandshakeMessageComposer);
        this._composers.set(OutgoingHeader.GET_IDENTITY_AGREEMENT_TYPES, GetIdentityAgreementTypesComposer);
    }

    public get events(): Map<number, Function>
    {
        return this._events;
    }

    public get composers(): Map<number, Function>
    {
        return this._composers;
    }
}
