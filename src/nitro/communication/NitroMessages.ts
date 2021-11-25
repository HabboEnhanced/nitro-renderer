import { DhCompleteHandshakeMessageEvent } from './messages/incoming/handshake/DhCompleteHandshakeMessageEvent';
import { CompleteDhHandshakeMessageComposer } from './messages/outgoing/handshake/CompleteDhHandshakeMessageComposer';
import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { DhInitHandshakeMessageEvent } from './messages/incoming/handshake/DhInitHandshakeMessageEvent';
import { IncomingHeader } from './messages/incoming/IncomingHeader';
import { ClientReleaseVersionComposer } from './messages/outgoing/client/ClientReleaseVersionComposer';
import { InitDhHandshakeComposer } from './messages/outgoing/handshake/InitDhHandshakeComposer';
import { GetIdentityAgreementTypesComposer } from './messages/outgoing/handshake/GetIdentityAgreementTypesComposer';
import { VersionCheckComposer } from './messages/outgoing/handshake/VersionCheckComposer';
import { OutgoingHeader } from './messages/outgoing/OutgoingHeader';
import { ClientPingEvent } from './messages/incoming/client/ClientPingEvent';
import { ClientPongComposer } from './messages/outgoing/client/ClientPongComposer';
import { LoginWithPasswordComposer, LoginWithTicketComposer, LoginWithTokenComposer } from './messages/outgoing/handshake';
import { UniqueMachineIdComposer } from './messages/outgoing/handshake/UniqueMachineIdComposer';
import { AuthenticatedEvent } from './messages/incoming/security/AuthenticatedEvent';

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
        this._events.set(IncomingHeader.DhInitHandshake, DhInitHandshakeMessageEvent);
        this._events.set(IncomingHeader.DhCompleteHandshake, DhCompleteHandshakeMessageEvent);
        this._events.set(IncomingHeader.Ping, ClientPingEvent);
        this._events.set(IncomingHeader.Ok, AuthenticatedEvent);
    }

    private registerComposers(): void
    {
        this._composers.set(OutgoingHeader.Hello, ClientReleaseVersionComposer);
        this._composers.set(OutgoingHeader.InitDhHandshake, InitDhHandshakeComposer);
        this._composers.set(OutgoingHeader.CompleteDhHandshake, CompleteDhHandshakeMessageComposer);
        this._composers.set(OutgoingHeader.GetIdentityAgreementTypes, GetIdentityAgreementTypesComposer);
        this._composers.set(OutgoingHeader.Pong, ClientPongComposer);
        this._composers.set(OutgoingHeader.VersionCheck, VersionCheckComposer);
        this._composers.set(OutgoingHeader.UniqueMachineId, UniqueMachineIdComposer);
        this._composers.set(OutgoingHeader.LoginWithTicket, LoginWithTicketComposer);
        this._composers.set(OutgoingHeader.LoginWithPassword, LoginWithPasswordComposer);
        this._composers.set(OutgoingHeader.LoginWithToken, LoginWithTokenComposer);
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
