import { Resource, Texture } from '@pixi/core';

export class PlaneTextureBitmap
{
    public static MIN_NORMAL_COORDINATE_VALUE: number = -1;
    public static MAX_NORMAL_COORDINATE_VALUE: number = 1;

    private _bitmap: Texture<Resource>;
    private _normalMinX: number;
    private _normalMaxX: number;
    private _normalMinY: number;
    private _normalMaxY: number;
    private _assetName: string;

    constructor(k: Texture<Resource>, _arg_2: number = -1, _arg_3: number = 1, _arg_4: number = -1, _arg_5: number = 1, _arg_6: string = null)
    {
        this._normalMinX    = _arg_2;
        this._normalMaxX    = _arg_3;
        this._normalMinY    = _arg_4;
        this._normalMaxY    = _arg_5;
        this._assetName     = _arg_6;
        this._bitmap        = k;
    }

    public get bitmap(): Texture<Resource>
    {
        return this._bitmap;
    }

    public get normalMinX(): number
    {
        return this._normalMinX;
    }

    public get normalMaxX(): number
    {
        return this._normalMaxX;
    }

    public get normalMinY(): number
    {
        return this._normalMinY;
    }

    public get normalMaxY(): number
    {
        return this._normalMaxY;
    }

    public get assetName(): string
    {
        return this._assetName;
    }

    public dispose(): void
    {
        this._bitmap = null;
    }
}
