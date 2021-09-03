import { INitroManager } from '../..';

export interface IGroupBadgeRenderManager extends INitroManager
{
    renderBadge(badge: string): Promise<string>;
    dispose(): void;
}
