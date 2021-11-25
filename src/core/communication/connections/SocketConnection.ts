import { Nitro } from '../../../nitro/Nitro';
import { NitroLogger } from '../../common/logger/NitroLogger';
import { EventDispatcher } from '../../events/EventDispatcher';
import { EvaWireFormat } from '../codec/evawire/EvaWireFormat';
import { ICodec } from '../codec/ICodec';
import { SocketConnectionEvent } from '../events/SocketConnectionEvent';
import { ICommunicationManager } from '../ICommunicationManager';
import { IMessageComposer } from '../messages/IMessageComposer';
import { IMessageConfiguration } from '../messages/IMessageConfiguration';
import { IMessageDataWrapper } from '../messages/IMessageDataWrapper';
import { IMessageEvent } from '../messages/IMessageEvent';
import { MessageClassManager } from '../messages/MessageClassManager';
import { WebSocketEventEnum } from './enums/WebSocketEventEnum';
import { ClientCertificate } from './enums/ClientCertificate';
import { IConnection } from './IConnection';
import { IConnectionStateListener } from './IConnectionStateListener';
import * as forge from 'node-forge';
import SocketEncryption from './SocketEncryption';

export class SocketConnection extends EventDispatcher implements IConnection
{
    private _communicationManager: ICommunicationManager;
    private _stateListener: IConnectionStateListener;
    private _socket: WebSocket;
    private _messages: MessageClassManager;
    private _codec: ICodec;
    private _dataBuffer: ArrayBuffer;
    private _isReady: boolean;
    private _tls: forge.tls.Connection;
    private _socketEncryption: SocketEncryption;

    private _pendingClientMessages: IMessageComposer<unknown[]>[];
    private _pendingServerMessages: IMessageDataWrapper[];

    private _isAuthenticated: boolean;

    constructor(communicationManager: ICommunicationManager, stateListener: IConnectionStateListener)
    {
        super();

        this._communicationManager  = communicationManager;
        this._stateListener         = stateListener;
        this._socket                = null;
        this._messages              = new MessageClassManager();
        this._codec                 = new EvaWireFormat();
        this._dataBuffer            = null;
        this._isReady               = false;
        this._socketEncryption                = new SocketEncryption();

        this._pendingClientMessages = [];
        this._pendingServerMessages = [];

        this._isAuthenticated       = false;

        this.onOpen     = this.onOpen.bind(this);
        this.onClose    = this.onClose.bind(this);
        this.onError    = this.onError.bind(this);
        this.onMessage  = this.onMessage.bind(this);
    }

    public init(socketUrl: string): void
    {
        if(this._stateListener)
        {
            this._stateListener.connectionInit(socketUrl);
        }

        this.createSocket(socketUrl);
    }

    protected onDispose(): void
    {
        super.onDispose();

        this.destroySocket();

        this._communicationManager  = null;
        this._stateListener         = null;
        this._messages              = null;
        this._codec                 = null;
        this._dataBuffer            = null;
    }

    public onReady(): void
    {
        if(this._isReady) return;

        this._isReady = true;

        if(this._pendingServerMessages && this._pendingServerMessages.length) this.processWrappers(...this._pendingServerMessages);

        if(this._pendingClientMessages && this._pendingClientMessages.length) this.send(...this._pendingClientMessages);

        this._pendingServerMessages = [];
        this._pendingClientMessages = [];
    }

    private createSocket(socketUrl: string): void
    {
        if(!socketUrl) return;

        this.destroySocket();

        this._dataBuffer    = new ArrayBuffer(0);
        this._socket        = new WebSocket(socketUrl);
        this._socket.binaryType = 'arraybuffer';
        this.buildForgeClient();

        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_OPENED, this.onOpen);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this.onClose);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_ERROR, this.onError);
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_MESSAGE, this.onMessage);
    }

    private buildForgeClient(): void
    {
        this._tls = forge.tls.createConnection({
            server: false,
            caStore: forge.pki.createCaStore([ClientCertificate.CERTIFICATE_AUTHORITY]),
            sessionCache: null,
            cipherSuites: [
                forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA
            ],
            verify: (c, verified, depth, certs): forge.tls.Verified =>
            {
                const firstCertOrganization = certs[0].subject.getField('O').value;
                const firstCertCommonName = certs[0].subject.getField('CN').value;
                const secondCertOrganization = certs[1].subject.getField('O').value;
                const secondCertCommonName = certs[1].subject.getField('CN').value;

                return <forge.tls.Verified>(firstCertOrganization == 'Sulake Oy' && firstCertCommonName == 'game-*.habbo.com' && secondCertOrganization == 'Sulake Corporation Oy' && secondCertCommonName == 'Sulake Certificate Autority G2');
            },
            getCertificate: (c, hint) =>
            {
                return ClientCertificate.CLIENT_CERTIFICATE;
            },
            getPrivateKey: (c, cert) =>
            {
                return ClientCertificate.CLIENT_CERTIFICATE_KEY;
            },
            connected: c =>
            {
                this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_OPENED, null);
            },
            tlsDataReady: c =>
            {
                const bytes = c.tlsData.getBytes();
                this._socket.send(this.stringToBuffer(bytes));
            },
            dataReady: c =>
            {
                const response = c.data.getBytes();

                this._dataBuffer = this.concatArrayBuffers(this._dataBuffer, this.stringToBuffer(response));
                this.processReceivedData();
            },
            closed: c =>
            {
                this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_CLOSED, null);
                this.destroySocket();
                console.log('closed');
            },
            error: (c, error) =>
            {
                this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_ERROR, null);
                this.destroySocket();
                console.error('error', error);
            }
        });
    }

    private destroySocket(): void
    {
        if(!this._socket) return;

        this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_OPENED, this.onOpen);
        this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this.onClose);
        this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_ERROR, this.onError);
        this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_MESSAGE, this.onMessage);

        if(this._socket.readyState === WebSocket.OPEN) this._socket.close();

        this._socket = null;
    }

    private onOpen(event: Event): void
    {
        this._socket.send(this.stringToBuffer('StartTLS'));
    }

    private onClose(event: CloseEvent): void
    {
        this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_CLOSED, event);
    }

    private onError(event: Event): void
    {
        this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_ERROR, event);
    }

    private onMessage(event: MessageEvent): void
    {
        if(!event) return;

        //this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_MESSAGE, event);
        const buffer: Uint8Array = new Uint8Array(event.data);

        if(buffer.length == 0)
            return;

        if(buffer.length == 2 && buffer[0] == 79 && buffer[1] == 75)
        {
            this._tls.handshake();
        }
        else
        {
            this._tls.process(String.fromCharCode.apply(null, buffer));
        }
    }

    public stringToBuffer(string: string): ArrayBuffer
    {
        const buf = new ArrayBuffer(string.length);
        const bufView = new Uint8Array(buf);
        for(let i = 0, strLen = string.length; i < strLen; i++)
        {
            bufView[i] = string.charCodeAt(i);
        }

        return buf;
    }

    private dispatchConnectionEvent(type: string, event: Event): void
    {
        this.dispatchEvent(new SocketConnectionEvent(type, this, event));
    }

    public authenticated(): void
    {
        this._isAuthenticated = true;
    }

    public send(...composers: IMessageComposer<unknown[]>[]): boolean
    {
        if(this.disposed || !composers) return false;

        composers = [ ...composers ];

        if(this._isAuthenticated && !this._isReady)
        {
            if(!this._pendingClientMessages) this._pendingClientMessages = [];

            this._pendingClientMessages.push(...composers);

            return false;
        }

        for(const composer of composers)
        {
            if(!composer) continue;

            const header = this._messages.getComposerId(composer);

            if(header === -1)
            {
                NitroLogger.log(`Unknown Composer: ${ composer.constructor.name }`);

                continue;
            }

            const message   = composer.getMessageArray();
            const encoded   = this._codec.encode(header, message);

            if(!encoded)
            {
                if(Nitro.instance.getConfiguration<boolean>('system.packet.log')) console.log(`Encoding Failed: ${ composer.constructor.name }`);

                continue;
            }

            if(Nitro.instance.getConfiguration<boolean>('system.packet.log')) console.log(`OutgoingComposer: [${ header }] ${ composer.constructor.name }`, message);

            if(this._socketEncryption.outgoingChaCha)
            {
                const outBuffer = new Uint8Array(encoded.getBuffer());
                const bytesToEncrypt = new Uint8Array([outBuffer[5], outBuffer[4]]);
                const encryptedBytes: Uint8Array = this._socketEncryption.outgoingChaCha.encrypt(bytesToEncrypt);
                outBuffer[4] = encryptedBytes[1];
                outBuffer[5] = encryptedBytes[0];

                this.write(outBuffer.buffer);
            }
            else
            {
                this.write(encoded.getBuffer());
            }
        }

        return true;
    }

    private write(buffer: ArrayBuffer): void
    {
        if(this._socket.readyState !== WebSocket.OPEN) return;

        this._tls.prepare(String.fromCharCode.apply(null, new Uint8Array(buffer)));
    }

    public processReceivedData(): void
    {
        try
        {
            this.processData();
        }

        catch (err)
        {
            NitroLogger.log(err);
        }
    }

    private processData(): void
    {
        const wrappers = this.splitReceivedMessages();

        if(!wrappers || !wrappers.length) return;

        if(this._isAuthenticated && !this._isReady)
        {
            if(!this._pendingServerMessages) this._pendingServerMessages = [];

            this._pendingServerMessages.push(...wrappers);

            return;
        }

        this.processWrappers(...wrappers);
    }

    private processWrappers(...wrappers: IMessageDataWrapper[]): void
    {
        if(!wrappers || !wrappers.length) return;

        for(const wrapper of wrappers)
        {
            if(!wrapper) continue;

            const messages = this.getMessagesForWrapper(wrapper);

            if(!messages || !messages.length) continue;

            if(Nitro.instance.getConfiguration<boolean>('system.packet.log'))
            {
                console.log(`IncomingMessage: [${ wrapper.header }] ${ messages[0].constructor.name }`, messages[0].parser);
            }

            this.handleMessages(...messages);
        }
    }

    private splitReceivedMessages(): IMessageDataWrapper[]
    {
        if(!this._dataBuffer || !this._dataBuffer.byteLength) return null;

        return this._codec.decode(this);
    }

    private concatArrayBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer
    {
        const array = new Uint8Array(buffer1.byteLength + buffer2.byteLength);

        array.set(new Uint8Array(buffer1), 0);
        array.set(new Uint8Array(buffer2), buffer1.byteLength);

        return array.buffer;
    }

    private getMessagesForWrapper(wrapper: IMessageDataWrapper): IMessageEvent[]
    {
        if(!wrapper) return null;

        const events = this._messages.getEvents(wrapper.header);

        if(!events || !events.length)
        {
            if(Nitro.instance.getConfiguration<boolean>('system.packet.log'))
            {
                console.log(`IncomingMessage: [${ wrapper.header }] UNREGISTERED`, wrapper);
            }

            return;
        }

        try
        {
            const parser = events[0].parser;

            if(!parser || !parser.flush() || !parser.parse(wrapper)) return null;
        }

        catch (e)
        {
            NitroLogger.log(`Error parsing message: ${ e }`, events[0].constructor.name);

            return null;
        }

        return events;
    }

    private handleMessages(...messages: IMessageEvent[]): void
    {
        messages = [ ...messages ];

        for(const message of messages)
        {
            if(!message) continue;

            message.connection = this;

            if(message.callBack) message.callBack(message);
        }
    }

    public registerMessages(configuration: IMessageConfiguration): void
    {
        if(!configuration) return;

        this._messages.registerMessages(configuration);
    }

    public addMessageEvent(event: IMessageEvent): void
    {
        if(!event || !this._messages) return;

        this._messages.registerMessageEvent(event);
    }

    public removeMessageEvent(event: IMessageEvent): void
    {
        if(!event || !this._messages) return;

        this._messages.removeMessageEvent(event);
    }

    public get isAuthenticated(): boolean
    {
        return this._isAuthenticated;
    }

    public get dataBuffer(): ArrayBuffer
    {
        return this._dataBuffer;
    }

    public set dataBuffer(buffer: ArrayBuffer)
    {
        this._dataBuffer = buffer;
    }

    public get socketEncryption(): SocketEncryption
    {
        return this._socketEncryption;
    }
}
