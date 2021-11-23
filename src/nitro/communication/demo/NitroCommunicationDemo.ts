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
import { SecurityTicketComposer } from '../messages/outgoing/handshake/SecurityTicketComposer';
import { InitDhHandshakeComposer } from '../messages/outgoing/handshake/InitDhHandshakeComposer';
import { NitroCommunicationDemoEvent } from './NitroCommunicationDemoEvent';
import { DhInitHandshakeMessageEvent } from '../messages/incoming/handshake/DhInitHandshakeMessageEvent';
import { BigInteger } from 'jsbn';
import SocketEncryption from '../../../core/communication/connections/SocketEncryption';
import { CompleteDhHandshakeMessageComposer } from '../messages/outgoing/handshake/CompleteDhHandshakeMessageComposer';
import { DhCompleteHandshakeMessageEvent } from '../messages/incoming/handshake/DhCompleteHandshakeMessageEvent';
import ChaCha20 from '../../../core/communication/encryption/ChaCha20';

export class NitroCommunicationDemo extends NitroManager
{
    private _communication: INitroCommunicationManager;

    private _sso: string;
    private _handShaking: boolean;
    private _didConnect: boolean;

    private _pongInterval: any;

    constructor(communication: INitroCommunicationManager)
    {
        super();

        this._communication = communication;

        this._sso           = null;
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
        /*this._communication.registerMessageEvent(new ClientPingEvent(this.onClientPingEvent.bind(this)));
        this._communication.registerMessageEvent(new AuthenticatedEvent(this.onAuthenticatedEvent.bind(this)));*/
    }

    private onDhCompleteHandshakeMessageEvent(event: DhCompleteHandshakeMessageEvent) : void
    {
        if(!event || !event.connection) return;
        let socketEncryption: SocketEncryption = event.connection.socketEncryption;

        let serverPublicKey: BigInteger = new BigInteger(socketEncryption.rsa.verify(event.getParser().serverPublicKey), 10);
        let sharedKey: BigInteger = serverPublicKey.modPow(socketEncryption.dhPrivateKey, socketEncryption.dhPrime);
        let sharedKeyByteArray = sharedKey.toByteArray(true);
        let chachaKey: Uint8Array = new Uint8Array(32);

        for(let i = 0; i < sharedKeyByteArray; i++)
          chachaKey[i] = sharedKeyByteArray[i];

        let ivBytes: Uint8Array = new Uint8Array([0x18, 0x19, 0x40, 0x55, 0xFE, 0xC4, 0x34, 0xF9]);

        socketEncryption.incomingChaCha = new ChaCha20(chachaKey, ivBytes, 0);
        socketEncryption.outgoingChaCha = new ChaCha20(chachaKey, ivBytes, 0);
    }

    private onDhInitHandshakeMessageEvent(event: DhInitHandshakeMessageEvent): void
    {
        if(!event || !event.connection) return;
        let socketEncryption: SocketEncryption = event.connection.socketEncryption;

        socketEncryption.dhPrime = new BigInteger(socketEncryption.rsa.verify(event.getParser().prime), 10);
        socketEncryption.dhGenerator = new BigInteger(socketEncryption.rsa.verify(event.getParser().generator), 10);

        socketEncryption.dhPrivateKey = new BigInteger('1835282320', 10);
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

        this.startHandshake(connection);//

        //this.tryAuthentication(connection);
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
        if(!connection || !this._sso)
        {
            if(!this._sso)
            {
                NitroLogger.log('Login without an SSO ticket is not supported');
            }

            this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, connection);

            return;
        }

        connection.send(new SecurityTicketComposer(this._sso, Nitro.instance.time));
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

        event.connection.send(new InfoRetrieveBaseMessageComposer());
    }

    public setSSO(sso: string): void
    {
        if(!sso || (sso === '') || this._sso) return;

        this._sso = sso;
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
