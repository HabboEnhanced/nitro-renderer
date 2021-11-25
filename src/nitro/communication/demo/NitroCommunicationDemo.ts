import { NitroLogger } from '../../../core/common/logger/NitroLogger';
import { NitroManager } from '../../../core/common/NitroManager';
import { IConnection } from '../../../core/communication/connections/IConnection';
import { SocketConnectionEvent } from '../../../core/communication/events/SocketConnectionEvent';
import { Nitro } from '../../Nitro';
import { INitroCommunicationManager } from '../INitroCommunicationManager';
import { ClientPingEvent } from '../messages/incoming/client/ClientPingEvent';
import { AuthenticatedEvent } from '../messages/incoming/security/AuthenticatedEvent';
import { ClientPongComposer } from '../messages/outgoing/client/ClientPongComposer';
import { ClientReleaseVersionComposer } from '../messages/outgoing/client/ClientReleaseVersionComposer';
import { InfoRetrieveBaseMessageComposer } from '../messages/outgoing/handshake/InfoRetrieveBaseMessageComposer';
import { InitDhHandshakeComposer } from '../messages/outgoing/handshake/InitDhHandshakeComposer';
import { NitroCommunicationDemoEvent } from './NitroCommunicationDemoEvent';
import { DhInitHandshakeMessageEvent } from '../messages/incoming/handshake/DhInitHandshakeMessageEvent';
import { BigInteger } from 'jsbn';
import SocketEncryption from '../../../core/communication/connections/SocketEncryption';
import { CompleteDhHandshakeMessageComposer } from '../messages/outgoing/handshake/CompleteDhHandshakeMessageComposer';
import { DhCompleteHandshakeMessageEvent } from '../messages/incoming/handshake/DhCompleteHandshakeMessageEvent';
import { GetIdentityAgreementTypesComposer } from '../messages/outgoing/handshake/GetIdentityAgreementTypesComposer';
import { VersionCheckComposer } from '../messages/outgoing/handshake/VersionCheckComposer';
import { LoginWithTicketComposer } from '../messages/outgoing/handshake/LoginWithTicketComposer';
import { LoginWithPasswordComposer } from '../messages/outgoing/handshake/LoginWithPasswordComposer';
import { LoginWithTokenComposer } from '../messages/outgoing/handshake/LoginWithTokenComposer';
import { UniqueMachineIdComposer } from '../messages/outgoing/handshake/UniqueMachineIdComposer';
import ChaCha20 from '../../../core/communication/encryption/ChaCha20';

export class NitroCommunicationDemo extends NitroManager
{
    private _communication: INitroCommunicationManager;

    private _sso: string;
    private _credentials: Array<string>;
    private _token: string;
    private _handShaking: boolean;
    private _didConnect: boolean;

    private _pongInterval: any;

    constructor(communication: INitroCommunicationManager)
    {
        super();

        this._communication = communication;

        this._sso           = null;
        this._credentials   = null;
        this._token         = null;
        this._handShaking   = false;
        this._didConnect    = false;

        this._pongInterval  = null;

        this.onConnectionOpenedEvent    = this.onConnectionOpenedEvent.bind(this);
        this.onConnectionClosedEvent    = this.onConnectionClosedEvent.bind(this);
        this.onConnectionErrorEvent     = this.onConnectionErrorEvent.bind(this);
        this.sendPong                   = this.sendPong.bind(this);
    }

    protected onInit(): void
    {
        const connection = this._communication.connection;

        if(connection)
        {
            connection.addEventListener(SocketConnectionEvent.CONNECTION_OPENED, this.onConnectionOpenedEvent);
            connection.addEventListener(SocketConnectionEvent.CONNECTION_CLOSED, this.onConnectionClosedEvent);
            connection.addEventListener(SocketConnectionEvent.CONNECTION_ERROR, this.onConnectionErrorEvent);
        }

        this._communication.registerMessageEvent(new DhInitHandshakeMessageEvent(this.onDhInitHandshakeMessageEvent.bind(this)));
        this._communication.registerMessageEvent(new DhCompleteHandshakeMessageEvent(this.onDhCompleteHandshakeMessageEvent.bind(this)));
        this._communication.registerMessageEvent(new ClientPingEvent(this.onClientPingEvent.bind(this)));
        this._communication.registerMessageEvent(new AuthenticatedEvent(this.onAuthenticatedEvent.bind(this)));
    }

    private onDhCompleteHandshakeMessageEvent(event: DhCompleteHandshakeMessageEvent) : void
    {
        if(!event || !event.connection) return;
        const socketEncryption: SocketEncryption = event.connection.socketEncryption;

        const serverPublicKey: BigInteger = new BigInteger(socketEncryption.rsa.verify(event.getParser().serverPublicKey), 10);

        const sharedKey: BigInteger = serverPublicKey.modPow(socketEncryption.dhPrivateKey, socketEncryption.dhPrime);
        const sharedKeyByteArray = sharedKey.toByteArray(true);
        const chachaKey: Uint8Array = new Uint8Array(32);

        for(let i = 0; i < sharedKeyByteArray.length; i++)
            chachaKey[i] = sharedKeyByteArray[i];

        const ivBytes: Uint8Array = new Uint8Array([0x18, 0x19, 0x40, 0x55, 0xFE, 0xC4, 0x34, 0xF9]);

        socketEncryption.incomingChaCha = new ChaCha20(chachaKey, ivBytes, 0);
        socketEncryption.outgoingChaCha = new ChaCha20(chachaKey, ivBytes, 0);

        event.connection.send(new GetIdentityAgreementTypesComposer());
        event.connection.send(new VersionCheckComposer(0, '0.21.0', ''));

        const randomMachineId: string = [...Array(76)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        event.connection.send(new UniqueMachineIdComposer(randomMachineId, 'n/a', 'Chrome 95.0.4638.69', 'n/a'));

        this.tryAuthentication(event.connection);
    }

    private onDhInitHandshakeMessageEvent(event: DhInitHandshakeMessageEvent): void
    {
        if(!event || !event.connection) return;
        const socketEncryption: SocketEncryption = event.connection.socketEncryption;

        socketEncryption.dhPrime = new BigInteger(socketEncryption.rsa.verify(event.getParser().prime), 10);
        socketEncryption.dhGenerator = new BigInteger(socketEncryption.rsa.verify(event.getParser().generator), 10);

        socketEncryption.dhPrivateKey = new BigInteger([...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''), 16);
        socketEncryption.dhClientPublicKey = socketEncryption.dhGenerator.modPow(socketEncryption.dhPrivateKey, socketEncryption.dhPrime);

        event.connection.send(new CompleteDhHandshakeMessageComposer(socketEncryption.rsa.encrypt(socketEncryption.dhClientPublicKey.toString())));
    }

    protected onDispose(): void
    {
        const connection = this._communication.connection;

        if(connection)
        {
            connection.removeEventListener(SocketConnectionEvent.CONNECTION_OPENED, this.onConnectionOpenedEvent);
            connection.removeEventListener(SocketConnectionEvent.CONNECTION_CLOSED, this.onConnectionClosedEvent);
            connection.removeEventListener(SocketConnectionEvent.CONNECTION_ERROR, this.onConnectionErrorEvent);
        }

        this._sso           = null;
        this._handShaking   = false;

        this.stopPonging();

        super.onDispose();
    }

    private onConnectionOpenedEvent(event: Event): void
    {
        const connection = this._communication.connection;

        if(!connection) return;

        this._didConnect = true;

        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, connection);

        if(Nitro.instance.getConfiguration<boolean>('system.pong.manually', false)) this.startPonging();

        connection.send(new ClientReleaseVersionComposer(null, null, null, null));

        this.startHandshake(connection);
    }

    private onConnectionClosedEvent(event: CloseEvent): void
    {
        const connection = this._communication.connection;

        if(!connection) return;

        this.stopPonging();

        if(this._didConnect) this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_CLOSED, connection);
    }

    private onConnectionErrorEvent(event: CloseEvent): void
    {
        const connection = this._communication.connection;

        if(!connection) return;

        this.stopPonging();

        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_ERROR, connection);
    }

    private tryAuthentication(connection: IConnection): void
    {
        if(this._sso)
        {
            connection.send(new LoginWithTicketComposer(this._sso, Nitro.instance.time));
            return;
        }

        if(this._credentials)
        {
            connection.send(new LoginWithPasswordComposer(this._credentials[0], this._credentials[1], 0, 0));
            return;
        }

        if(this._token)
        {
            connection.send(new LoginWithTokenComposer(this._token));
            return;
        }

        NitroLogger.log('Provide at least one authentication method !');
        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, connection);
    }

    private onClientPingEvent(event: ClientPingEvent): void
    {
        if(!event || !event.connection) return;

        this.sendPong(event.connection);
    }

    private onAuthenticatedEvent(event: AuthenticatedEvent): void
    {
        if(!event || !event.connection) return;

        this.completeHandshake(event.connection);

        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, event.connection);

        //event.connection.send(new UserHomeRoomComposer(555));

        //event.connection.send(new InfoRetrieveBaseMessageComposer());
    }

    public setSSO(sso: string): void
    {
        if(!sso || (sso === '') || this._sso) return;

        this._sso = sso;
    }

    public setCredentials(credentials: Array<string>): void
    {
        if(!credentials || (credentials.length === 0) || this._credentials) return;

        this._credentials = credentials;
    }

    public setToken(token: string): void
    {
        if(!token || (token === '') || this._token) return;

        this._token = token;
    }

    private startHandshake(connection: IConnection): void
    {
        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, connection);

        this._handShaking = true;

        connection.send(new InitDhHandshakeComposer());
    }

    private completeHandshake(connection: IConnection): void
    {
        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, connection);

        this._handShaking = false;
    }

    private startPonging(): void
    {
        this.stopPonging();

        this._pongInterval = setInterval(this.sendPong, Nitro.instance.getConfiguration<number>('system.pong.interval.ms', 20000));
    }

    private stopPonging(): void
    {
        if(!this._pongInterval) return;

        clearInterval(this._pongInterval);

        this._pongInterval = null;
    }

    private sendPong(connection: IConnection = null): void
    {
        connection = ((connection || this._communication.connection) || null);

        if(!connection) return;

        connection.send(new ClientPongComposer());
    }

    private dispatchCommunicationDemoEvent(type: string, connection: IConnection): void
    {
        Nitro.instance.events.dispatchEvent(new NitroCommunicationDemoEvent(type, connection));
    }
}
