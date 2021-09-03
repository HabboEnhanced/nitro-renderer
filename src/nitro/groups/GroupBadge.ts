import { NitroContainer, NitroSprite } from '../..';
import { GroupBadgePartAsset } from './GroupBadgePartAsset';

export class GroupBadge
{
    private _parts: GroupBadgePartAsset[];
    private _str: string;
    private _container: NitroContainer;

    constructor(str: string)
    {
        this._parts = [];
        this._str = str;
        this._container = new NitroContainer();
    }

    public render(): void
    {
        for(const part of this.parts)
        {
            for(const texture of part.textures)
            {
                const sprite = new NitroSprite(texture);
                const pos = part.calculatePosition(texture);
                sprite.x = pos.x;
                sprite.y = pos.y;
                sprite.tint = parseInt(part.color, 16);
                this._container.addChild(sprite);
            }
        }
    }

    public get parts(): GroupBadgePartAsset[]
    {
        return this._parts;
    }

    public get str(): string
    {
        return this._str;
    }

    public get container(): NitroContainer
    {
        return this._container;
    }
}
