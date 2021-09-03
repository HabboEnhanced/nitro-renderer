import { IMessageEvent, NitroTexture } from '../../core';
import { NitroManager } from '../../core/common/NitroManager';
import { TextureUtils } from '../../room/utils/TextureUtils';
import { GroupBadgePartsEvent } from '../communication/messages/incoming/group/GroupBadgePartsEvent';
import { GroupBadgePartsComposer } from '../communication/messages/outgoing/group/GroupBadgePartsComposer';
import { Nitro } from '../Nitro';
import { GroupBadge } from './GroupBadge';
import { GroupBadgePartAsset } from './GroupBadgePartAsset';
import { IGroupBadgeRenderManager } from './IGroupBadgeRenderManager';

export class GroupBadgeRenderManager extends NitroManager implements IGroupBadgeRenderManager
{
    private _bases: Map<number, string[]>;
    private _symbols: Map<number, string[]>;
    private _partColors: Map<number, string>;
    private _assets: Map<string, NitroTexture>;
    private _isReady: boolean;
    private _messages: IMessageEvent[];

    constructor()
    {
        super();
        this._isReady = false;
        this._bases = new Map();
        this._symbols = new Map();
        this._partColors = new Map();
        this._assets = new Map();
        this._messages = [];
    }

    public onInit()
    {
        this._messages.push(new GroupBadgePartsEvent(this.initData.bind(this)));
        this._messages.forEach(m => Nitro.instance.communication.registerMessageEvent(m));

        Nitro.instance.communication.connection.send(new GroupBadgePartsComposer());
    }

    public onDispose()
    {
        this._messages.forEach(m => Nitro.instance.communication.removeMessageEvent(m));
    }

    public async renderBadge(badgeStr: string): Promise<string>
    {
        if(!this._isReady) return Promise.reject('Not ready');

        const badge = new GroupBadge(badgeStr);

        let partIndex = 0;
        for(let i = 0; i < badgeStr.length; i+=6)
        {
            const partType = badgeStr.slice(i, i + 1);
            let partId = parseInt(badgeStr.slice(i + 1, i + 3));
            const color = parseInt(badgeStr.slice(i + 3, i + 5));
            const position = parseInt(badgeStr.slice(i + 5, i + 6));

            if(partType === 't') partId += 100;

            const assets = partType === 'b' ? this._bases.get(partId) : this._symbols.get(partId);

            const textures: NitroTexture[] = [];

            for(const asset of assets)
            {
                if(asset.length > 0)
                {
                    if(!this._assets.has(asset))
                    {
                        const loadedAsset = await this.loadAsset(asset);
                        this._assets.set(asset, loadedAsset);
                    }

                    textures.push(this._assets.get(asset));
                }
            }

            badge.parts.push(new GroupBadgePartAsset(textures, position, this._partColors.get(color), partIndex));

            partIndex++;
        }

        badge.render();
        return Promise.resolve(TextureUtils.generateImageUrl(badge.container));
    }

    private initData(event: GroupBadgePartsEvent): void
    {
        if(!event) return;

        const data = event.getParser();

        if(!data) return;

        data.bases.forEach( (names, id) =>
        {
            this._bases.set(id, names.map( val => val.replace('.png', '').replace('.gif', '')));
        });

        data.symbols.forEach( (names, id) =>
        {
            this._symbols.set(id, names.map( val => val.replace('.png', '').replace('.gif', '')));
        });

        this._partColors = data.partColors;
        this._isReady = true;

        console.log(this.renderBadge('s84033s86034s97035'));
    }

    private loadAsset(name: string): Promise<NitroTexture>
    {
        return new Promise((resolve, reject) =>
        {
            const image = new Image();
            const sourceUrl =  Nitro.instance.getConfiguration<string[]>('image.library.badgepart.url');
            const imgSrc = (((sourceUrl + 'badgepart_') + name) + '.png');

            image.crossOrigin   = '*';

            image.onload = () => resolve(NitroTexture.from(image));
            image.onerror = reject;
            image.src           = imgSrc;
        });
    }
}
