import { NitroManager } from '../../core/common/NitroManager';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IConnectionStateListener } from '../../core/communication/connections/IConnectionStateListener';
import { SocketConnectionEvent } from '../../core/communication/events/SocketConnectionEvent';
import { ICommunicationManager } from '../../core/communication/ICommunicationManager';
import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { IMessageEvent } from '../../core/communication/messages/IMessageEvent';
import { NitroEvent } from '../../core/events/NitroEvent';
import { Nitro } from '../Nitro';
import { NitroCommunicationDemo } from './demo/NitroCommunicationDemo';
import { NitroCommunicationDemoEvent } from './demo/NitroCommunicationDemoEvent';
import { INitroCommunicationManager } from './INitroCommunicationManager';
import { NitroMessages } from './NitroMessages';

export class NitroCommunicationManager extends NitroManager implements INitroCommunicationManager, IConnectionStateListener
{
    private _communication: ICommunicationManager;
    private _connection: IConnection;
    private _messages: IMessageConfiguration;

    private _demo: NitroCommunicationDemo;

    constructor(communication: ICommunicationManager)
    {
        super();

        this._communication = communication;
        this._connection    = null;
        this._messages      = new NitroMessages();

        this._demo          = new NitroCommunicationDemo(this);

        this.onConnectionOpenedEvent        = this.onConnectionOpenedEvent.bind(this);
        this.onConnectionClosedEvent        = this.onConnectionClosedEvent.bind(this);
        this.onConnectionErrorEvent         = this.onConnectionErrorEvent.bind(this);
        this.onConnectionAuthenticatedEvent = this.onConnectionAuthenticatedEvent.bind(this);
    }

    protected onInit(): void
    {
        if(this._connection) return;

        Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onConnectionAuthenticatedEvent);

        this._connection = this._communication.createConnection(this);

        this._connection.registerMessages(this._messages);

        this._connection.addEventListener(SocketConnectionEvent.CONNECTION_OPENED, this.onConnectionOpenedEvent);
        this._connection.addEventListener(SocketConnectionEvent.CONNECTION_CLOSED, this.onConnectionClosedEvent);
        this._connection.addEventListener(SocketConnectionEvent.CONNECTION_ERROR, this.onConnectionErrorEvent);

        if(this._demo) this._demo.init();

        this._connection.init(this.getEndpointByCountry(Nitro.instance.getConfiguration<string>('socket.country')));
    }

    protected onDispose(): void
    {
        if(this._demo) this._demo.dispose();

        if(this._connection)
        {
            this._connection.removeEventListener(SocketConnectionEvent.CONNECTION_OPENED, this.onConnectionOpenedEvent);
            this._connection.removeEventListener(SocketConnectionEvent.CONNECTION_CLOSED, this.onConnectionClosedEvent);
            this._connection.removeEventListener(SocketConnectionEvent.CONNECTION_ERROR, this.onConnectionErrorEvent);
        }

        Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onConnectionAuthenticatedEvent);

        super.onDispose();
    }

    private onConnectionOpenedEvent(event: Event): void
    {
        this.logger.log('Connection Initialized');
    }

    private onConnectionClosedEvent(event: CloseEvent): void
    {
        this.logger.log('Connection Closed');
    }

    private onConnectionErrorEvent(event: Event): void
    {
        this.logger.log('Connection Error');
    }

    private onConnectionAuthenticatedEvent(event: NitroEvent): void
    {
        this.logger.log('Connection Authenticated');

        if(this._connection) this._connection.authenticated();
    }

    public connectionInit(socketUrl: string): void
    {
        this.logger.log(`Initializing Connection: ${ socketUrl }`);
    }

    public getEndpointByCountry(country: string): string
    {
        switch(country)
        {
            case 'com':
            case 'us':
                return 'wss://game-us.habbo.com:30001/websocket';
            case 'br':
                return 'wss://game-br.habbo.com:30001/websocket';
            case 'tr':
                return 'wss://game-tr.habbo.com:30001/websocket';
            case 'de':
                return 'wss://game-de.habbo.com:30001/websocket';
            case 'es':
                return 'wss://game-es.habbo.com:30001/websocket';
            case 'fi':
                return 'wss://game-fi.habbo.com:30001/websocket';
            case 'fr':
                return 'wss://game-fr.habbo.com:30001/websocket';
            case 'it':
                return 'wss://game-it.habbo.com:30001/websocket';
            case 'nl':
                return 'wss://game-nl.habbo.com:30001/websocket';
            case 'sandbox':
                return 'wss://game-s2.habbo.com:30001/websocket';
            default:
                throw new Error('Country not found.');
        }
    }

    public registerMessageEvent(event: IMessageEvent): IMessageEvent
    {
        if(this._connection) this._connection.addMessageEvent(event);

        return event;
    }

    public removeMessageEvent(event: IMessageEvent): void
    {
        if(!this._connection) return;

        this._connection.removeMessageEvent(event);
    }

    public get demo(): NitroCommunicationDemo
    {
        return this._demo;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }
}
