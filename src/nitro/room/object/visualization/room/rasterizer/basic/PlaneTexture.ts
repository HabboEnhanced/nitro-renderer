import { Resource, Texture } from '@pixi/core';
import { IVector3D } from '../../../../../../../room/utils/IVector3D';
import { PlaneTextureBitmap } from './PlaneTextureBitmap';

export class PlaneTexture
{
    public static MIN_NORMAL_COORDINATE_VALUE: number = -1;
    public static MAX_NORMAL_COORDINATE_VALUE: number = 1;

    private _bitmaps: PlaneTextureBitmap[];

    constructor()
    {
        this._bitmaps = [];
    }

    public dispose(): void
    {
        if(this._bitmaps)
        {
            for(const bitmap of this._bitmaps)
            {
                if(!bitmap) continue;

                bitmap.dispose();
            }

            this._bitmaps = null;
        }
    }

    public addBitmap(k: Texture<Resource>, _arg_2: number = -1, _arg_3: number = 1, _arg_4: number = -1, _arg_5: number = 1, _arg_6: string = null): void
    {
        this._bitmaps.push(new PlaneTextureBitmap(k, _arg_2, _arg_3, _arg_4, _arg_5, _arg_6));
    }

    public getBitmap(k: IVector3D): Texture<Resource>
    {
        const _local_2 = this.getPlaneTextureBitmap(k);

        if(!_local_2) return null;

        return _local_2.bitmap;
    }

    public getPlaneTextureBitmap(k: IVector3D): PlaneTextureBitmap
    {
        if(!k) return null;

        for(const bitmap of this._bitmaps)
        {
            if(!bitmap) continue;

            if((((k.x >= bitmap.normalMinX) && (k.x <= bitmap.normalMaxX)) && (k.y >= bitmap.normalMinY)) && (k.y <= bitmap.normalMaxY)) return bitmap;
        }

        return null;
    }

    public getAssetName(k: IVector3D): string
    {
        const _local_2 = this.getPlaneTextureBitmap(k);

        return (!_local_2) ? null : _local_2.assetName;
    }
}
