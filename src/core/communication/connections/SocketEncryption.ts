import RSAKey from '../encryption/RSAKey';
import RSA from '../encryption/RSA';
import { BigInteger } from 'jsbn';

export default class SocketEncryption
{
    private _rsa: any;
    private _dhPrime: BigInteger;
    private _dhGenerator: BigInteger;
    private _dhPrivateKey: BigInteger;
    private _dhClientPublicKey: BigInteger;
    private _incomingChaCha: any;
    private _outgoingChaCha: any;

    constructor()
    {
        this._rsa = new RSA();
        this._rsa.setPublic(RSAKey.N, RSAKey.E);

        this._incomingChaCha = null;
        this._outgoingChaCha = null;
    }

    public set incomingChaCha(incomingChaCha: any)
    {
        this._incomingChaCha = incomingChaCha;
    }

    public set outgoingChaCha(outgoingChaCha: any)
    {
        this._outgoingChaCha = outgoingChaCha;
    }

    public set dhPrime (dhPrime: BigInteger)
    {
        this._dhPrime = dhPrime;
    }

    public set dhGenerator (dhGenerator: BigInteger)
    {
        this._dhGenerator = dhGenerator;
    }

    public set dhPrivateKey (dhPrivateKey: BigInteger)
    {
        this._dhPrivateKey = dhPrivateKey;
    }

    public set dhClientPublicKey (dhClientPublicKey: BigInteger)
    {
        this._dhClientPublicKey = dhClientPublicKey;
    }

    public get incomingChaCha(): any
    {
        return this._incomingChaCha;
    }

    public get outgoingChaCha(): any
    {
        return this._outgoingChaCha;
    }

    public get dhGenerator(): BigInteger
    {
        return this._dhGenerator;
    }

    public get dhPrime(): BigInteger
    {
        return this._dhPrime;
    }

    public get dhPrivateKey(): BigInteger
    {
        return this._dhPrivateKey;
    }

    public get dhClientPublicKey(): BigInteger
    {
        return this._dhClientPublicKey;
    }

    public get rsa(): any
    {
        return this._rsa;
    }
}