import { NitroPoint, NitroTexture } from '../..';

export class GroupBadgePartAsset
{
    public static BASE_PART:number = 0;
    public static LAYER_PART:number = 1;
    public static IMAGE_WIDTH:number = 39;
    public static IMAGE_HEIGHT:number = 39;
    public static CELL_WIDTH:number = 13;
    public static CELL_HEIGHT:number = 13;

    private _textures: NitroTexture[];
    private _position: number;
    private _color: string;
    private _index: number

    constructor(texture: NitroTexture[], position: number, color: string, index: number)
    {
        this._textures = texture;
        this._position = position;
        this._color = color;
        this._index = index;
    }

    public calculatePosition(asset: NitroTexture) : NitroPoint
    {
        const gridPos = this.calculateGridPos(this._position);
        let x:number = (((GroupBadgePartAsset.CELL_WIDTH * gridPos.x) + (GroupBadgePartAsset.CELL_WIDTH / 2)) - (asset.width / 2));
        let y:number = (((GroupBadgePartAsset.CELL_HEIGHT * gridPos.y) + (GroupBadgePartAsset.CELL_HEIGHT / 2)) - (asset.height / 2));
        if(x < 0)
        {
            x = 0;
        }
        if((x + asset.width) > GroupBadgePartAsset.IMAGE_WIDTH)
        {
            x = (GroupBadgePartAsset.IMAGE_WIDTH - asset.width);
        }
        if(y < 0)
        {
            y = 0;
        }
        if((y + asset.height) > GroupBadgePartAsset.IMAGE_HEIGHT)
        {
            y = (GroupBadgePartAsset.IMAGE_HEIGHT - asset.height);
        }
        return new NitroPoint(Math.floor(x), Math.floor(y));
    }

    private calculateGridPos(gridVal: number): NitroPoint
    {
        const point = new NitroPoint();
        point.x = Math.floor((gridVal % 3));
        point.y = Math.floor((gridVal / 3));
        return point;
    }

    public get textures(): NitroTexture[]
    {
        return this._textures;
    }

    public get position(): number
    {
        return this._position;
    }

    public get color(): string
    {
        return this._color;
    }

    public get index(): number
    {
        return this._index;
    }
}
