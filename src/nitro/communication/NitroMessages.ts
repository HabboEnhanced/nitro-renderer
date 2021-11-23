import { DhCompleteHandshakeMessageEvent } from './messages/incoming/handshake/DhCompleteHandshakeMessageEvent';
import { CompleteDhHandshakeMessageComposer } from './messages/outgoing/handshake/CompleteDhHandshakeMessageComposer';
import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { DhInitHandshakeMessageEvent } from './messages/incoming/handshake/DhInitHandshakeMessageEvent';
import { IncomingHeader } from './messages/incoming/IncomingHeader';
import { ClientReleaseVersionComposer } from './messages/outgoing/client/ClientReleaseVersionComposer';
import { InitDhHandshakeComposer } from './messages/outgoing/handshake/InitDhHandshakeComposer';
import { OutgoingHeader } from './messages/outgoing/OutgoingHeader';

export class NitroMessages implements IMessageConfiguration
{
    private _events: Map<number, Function>;
    private _composers: Map<number, Function>;

    constructor()
    {
        this._events    = new Map();
        this._composers = new Map();

        this.registerEvents();
        this.registerComposers();
    }

    private registerEvents(): void
    {
        this._events.set(IncomingHeader.DH_INIT_HANDSHAKE, DhInitHandshakeMessageEvent);
        this._events.set(IncomingHeader.DH_COMPLETE_HANDSHAKE, DhCompleteHandshakeMessageEvent);
        /*// AVAILABILITY
        this._events.set(IncomingHeader.AVAILABILITY_STATUS, AvailabilityStatusMessageEvent);
        this._events.set(IncomingHeader.GENERIC_ERROR, GenericErrorEvent);

        // AVATAR
        this._events.set(IncomingHeader.USER_CHANGE_NAME, ChangeUserNameResultMessageEvent);

        // CATALOG
        this._events.set(IncomingHeader.CATALOG_CLUB, CatalogClubEvent);
        this._events.set(IncomingHeader.CATALOG_MODE, CatalogModeEvent);
        this._events.set(IncomingHeader.CATALOG_PAGE, CatalogPageEvent);
        this._events.set(IncomingHeader.CATALOG_PAGES, CatalogPagesEvent);
        this._events.set(IncomingHeader.CATALOG_PURCHASE, CatalogPurchaseEvent);
        this._events.set(IncomingHeader.CATALOG_PURCHASE_FAILED, CatalogPurchaseFailedEvent);
        this._events.set(IncomingHeader.CATALOG_PURCHASE_UNAVAILABLE, CatalogPurchaseUnavailableEvent);
        this._events.set(IncomingHeader.CATALOG_SEARCH, CatalogSearchEvent);
        this._events.set(IncomingHeader.CATALOG_SOLD_OUT, CatalogSoldOutEvent);
        this._events.set(IncomingHeader.CATALOG_UPDATED, CatalogUpdatedEvent);
        this._events.set(IncomingHeader.CATALOG_CLUB_GIFTS, CatalogClubGiftsEvent);
        this._events.set(IncomingHeader.GROUP_LIST, CatalogGroupsEvent);
        this._events.set(IncomingHeader.GIFT_CONFIG, CatalogGiftConfigurationEvent);
        this._events.set(IncomingHeader.REDEEM_VOUCHER_ERROR, CatalogRedeemVoucherErrorEvent);
        this._events.set(IncomingHeader.REDEEM_VOUCHER_OK, CatalogRedeemVoucherOkEvent);
        this._events.set(IncomingHeader.CATALOG_RECEIVE_PET_BREEDS, SellablePetPalettesEvent);
        this._events.set(IncomingHeader.CATALOG_APPROVE_NAME_RESULT, CatalogApproveNameResultEvent);
        this._events.set(IncomingHeader.BONUS_RARE_INFO, BonusRareInfoMessageEvent);

        // CLIENT
        this._events.set(IncomingHeader.CLIENT_PING, ClientPingEvent);

        // DESKTOP
        this._events.set(IncomingHeader.DESKTOP_VIEW, DesktopViewEvent);

        // FRIENDLIST
        this._events.set(IncomingHeader.MESSENGER_ACCEPT_FRIENDS, AcceptFriendResultEvent);
        this._events.set(IncomingHeader.MESSENGER_FIND_FRIENDS, FindFriendsProcessResultEvent);
        this._events.set(IncomingHeader.MESSENGER_FOLLOW_FAILED, FollowFriendFailedEvent);
        this._events.set(IncomingHeader.MESSENGER_FRIENDS, FriendListFragmentEvent);
        this._events.set(IncomingHeader.MESSENGER_UPDATE, FriendListUpdateEvent);
        this._events.set(IncomingHeader.MESSENGER_FRIEND_NOTIFICATION, FriendNotificationEvent);
        this._events.set(IncomingHeader.MESSENGER_REQUESTS, FriendRequestsEvent);
        this._events.set(IncomingHeader.MESSENGER_SEARCH, HabboSearchResultEvent);
        this._events.set(IncomingHeader.MESSENGER_INSTANCE_MESSAGE_ERROR, InstantMessageErrorEvent);
        this._events.set(IncomingHeader.MESSENGER_MESSAGE_ERROR, MessageErrorEvent);
        this._events.set(IncomingHeader.MESSENGER_INIT, MessengerInitEvent);
        this._events.set(IncomingHeader.MESSENGER_MINIMAIL_NEW, MiniMailNewMessageEvent);
        this._events.set(IncomingHeader.MESSENGER_MINIMAIL_COUNT, MiniMailUnreadCountParser);
        this._events.set(IncomingHeader.MESSENGER_CHAT, NewConsoleMessageEvent);
        this._events.set(IncomingHeader.MESSENGER_REQUEST, NewFriendRequestEvent);
        this._events.set(IncomingHeader.MESSENGER_INVITE_ERROR, RoomInviteErrorEvent);
        this._events.set(IncomingHeader.MESSENGER_INVITE, RoomInviteEvent);

        // GROUP
        this._events.set(IncomingHeader.GROUP_INFO, GroupInformationEvent);
        this._events.set(IncomingHeader.GROUP_MEMBER_REMOVE_CONFIRM, GroupConfirmMemberRemoveEvent);
        this._events.set(IncomingHeader.GROUP_MEMBERS, GroupMembersEvent);
        this._events.set(IncomingHeader.GROUP_CREATE_OPTIONS, GroupBuyDataEvent);
        this._events.set(IncomingHeader.GROUP_BADGE_PARTS, GroupBadgePartsEvent);
        this._events.set(IncomingHeader.GROUP_SETTINGS, GroupSettingsEvent);

        // HELP
        this._events.set(IncomingHeader.CFH_RESULT_MESSAGE, CallForHelpResultMessageEvent);

        // INVENTORY

        // ACHIEVEMENTS
        this._events.set(IncomingHeader.ACHIEVEMENT_PROGRESSED, AchievementEvent);
        this._events.set(IncomingHeader.ACHIEVEMENT_LIST, AchievementsEvent);
        this._events.set(IncomingHeader.USER_ACHIEVEMENT_SCORE,AchievementsScoreEvent);

        // EFFECTS
        this._events.set(IncomingHeader.USER_EFFECT_ACTIVATE, AvatarEffectActivatedEvent);
        this._events.set(IncomingHeader.USER_EFFECT_LIST_ADD, AvatarEffectAddedEvent);
        this._events.set(IncomingHeader.USER_EFFECT_LIST_REMOVE, AvatarEffectExpiredEvent);
        this._events.set(IncomingHeader.USER_EFFECT_LIST, AvatarEffectsEvent);

        // CLOTHES
        this._events.set(IncomingHeader.USER_CLOTHING, FigureSetIdsMessageEvent);

        // FURNITURE
        this._events.set(IncomingHeader.USER_FURNITURE_ADD, FurnitureListAddOrUpdateEvent);
        this._events.set(IncomingHeader.USER_FURNITURE, FurnitureListEvent);
        this._events.set(IncomingHeader.USER_FURNITURE_REFRESH, FurnitureListInvalidateEvent);
        this._events.set(IncomingHeader.USER_FURNITURE_REMOVE, FurnitureListRemovedEvent);
        this._events.set(IncomingHeader.USER_FURNITURE_POSTIT_PLACED, FurniturePostItPlacedEvent);

        // TRADING
        this._events.set(IncomingHeader.TRADE_ACCEPTED, TradingAcceptEvent);
        this._events.set(IncomingHeader.TRADE_CLOSED, TradingCloseEvent);
        this._events.set(IncomingHeader.TRADE_COMPLETED, TradingCompletedEvent);
        this._events.set(IncomingHeader.TRADE_CONFIRMATION, TradingConfirmationEvent);
        this._events.set(IncomingHeader.TRADE_LIST_ITEM, TradingListItemEvent);
        this._events.set(IncomingHeader.TRADE_NOT_OPEN, TradingNotOpenEvent);
        this._events.set(IncomingHeader.TRADE_OPEN_FAILED, TradingOpenFailedEvent);
        this._events.set(IncomingHeader.TRADE_OPEN, TradingOpenEvent);
        this._events.set(IncomingHeader.TRADE_OTHER_NOT_ALLOWED, TradingOtherNotAllowedEvent);
        this._events.set(IncomingHeader.TRADE_YOU_NOT_ALLOWED, TradingYouAreNotAllowedEvent);

        // MODERATION
        this._events.set(IncomingHeader.GENERIC_ALERT_LINK, ModeratorMessageEvent);

        // MODTOOL
        this._events.set(IncomingHeader.MODTOOL_ROOM_INFO, ModtoolRoomInfoEvent);
        this._events.set(IncomingHeader.MODTOOL_USER_CHATLOG, ModtoolUserChatlogEvent);
        this._events.set(IncomingHeader.MODTOOL_ROOM_CHATLOG, ModtoolRoomChatlogEvent);

        // MYSTERY BOX
        this._events.set(IncomingHeader.MYSTERY_BOX_KEYS, MysteryBoxKeysEvent);

        // NAVIGATOR
        this._events.set(IncomingHeader.NAVIGATOR_CATEGORIES, NavigatorCategoriesEvent);
        this._events.set(IncomingHeader.NAVIGATOR_COLLAPSED, NavigatorCollapsedEvent);
        this._events.set(IncomingHeader.NAVIGATOR_EVENT_CATEGORIES, NavigatorEventCategoriesEvent);
        this._events.set(IncomingHeader.USER_HOME_ROOM, NavigatorHomeRoomEvent);
        this._events.set(IncomingHeader.NAVIGATOR_LIFTED, NavigatorLiftedEvent);
        this._events.set(IncomingHeader.NAVIGATOR_METADATA, NavigatorMetadataEvent);
        this._events.set(IncomingHeader.NAVIGATOR_OPEN_ROOM_CREATOR, NavigatorOpenRoomCreatorEvent);
        this._events.set(IncomingHeader.NAVIGATOR_SEARCHES, NavigatorSearchesEvent);
        this._events.set(IncomingHeader.NAVIGATOR_SEARCH, NavigatorSearchEvent);
        this._events.set(IncomingHeader.NAVIGATOR_SETTINGS, NavigatorSettingsEvent);

        // NOTIFICATIONS
        this._events.set(IncomingHeader.GENERIC_ALERT, HabboBroadcastMessageEvent);
        this._events.set(IncomingHeader.MOTD_MESSAGES, MOTDNotificationEvent);
        this._events.set(IncomingHeader.NOTIFICATION_LIST, NotificationDialogMessageEvent);
        this._events.set(IncomingHeader.USER_RESPECT, RespectReceivedEvent);
        this._events.set(IncomingHeader.UNSEEN_ITEMS, UnseenItemsEvent);
        this._events.set(IncomingHeader.HOTEL_WILL_SHUTDOWN, HotelWillShutdownEvent);

        // ROOM

        // ACCESS
        this._events.set(IncomingHeader.ROOM_ENTER_ERROR, RoomEnterErrorEvent);
        this._events.set(IncomingHeader.ROOM_ENTER, RoomEnterEvent);
        this._events.set(IncomingHeader.ROOM_FORWARD, RoomForwardEvent);

        // DOORBELL
        this._events.set(IncomingHeader.ROOM_DOORBELL, RoomDoorbellEvent);
        this._events.set(IncomingHeader.ROOM_DOORBELL_ACCEPTED, RoomDoorbellAcceptedEvent);
        this._events.set(IncomingHeader.ROOM_DOORBELL_REJECTED, RoomDoorbellRejectedEvent);

        // RIGHTS
        this._events.set(IncomingHeader.ROOM_RIGHTS_CLEAR, RoomRightsClearEvent);
        this._events.set(IncomingHeader.ROOM_RIGHTS_OWNER, RoomRightsOwnerEvent);
        this._events.set(IncomingHeader.ROOM_RIGHTS, RoomRightsEvent);

        // DATA
        this._events.set(IncomingHeader.ROOM_SETTINGS_CHAT, RoomChatSettingsEvent);
        this._events.set(IncomingHeader.ROOM_INFO, RoomInfoEvent);
        this._events.set(IncomingHeader.ROOM_INFO_OWNER, RoomInfoOwnerEvent);
        this._events.set(IncomingHeader.ROOM_SCORE, RoomScoreEvent);
        this._events.set(IncomingHeader.ROOM_SETTINGS_SAVE_ERROR, RoomSettingsErrorEvent);
        this._events.set(IncomingHeader.ROOM_SETTINGS, RoomSettingsEvent);
        this._events.set(IncomingHeader.ROOM_SETTINGS_SAVE, RoomSettingsSavedEvent);
        this._events.set(IncomingHeader.ROOM_SETTINGS_UPDATED, RoomSettingsUpdatedEvent);
        this._events.set(IncomingHeader.ROOM_RIGHTS_LIST, RoomUsersWithRightsEvent);
        this._events.set(IncomingHeader.ROOM_BAN_LIST, RoomBannedUsersEvent);

        // ENGINE
        this._events.set(IncomingHeader.ROOM_ROLLING, ObjectsRollingEvent);
        this._events.set(IncomingHeader.ROOM_CREATED, RoomCreatedEvent);

        // BOTS
        this._events.set(IncomingHeader.BOT_COMMAND_CONFIGURATION, BotCommandConfigurationEvent);
        this._events.set(IncomingHeader.BOT_ERROR, BotErrorEvent);

        // FURNITURE
        this._events.set(IncomingHeader.FURNITURE_ALIASES, FurnitureAliasesEvent);
        this._events.set(IncomingHeader.FURNITURE_DATA, FurnitureDataEvent);
        this._events.set(IncomingHeader.FURNITURE_ITEMDATA, FurnitureItemDataEvent);
        this._events.set(IncomingHeader.ITEM_STACK_HELPER, FurnitureStackHeightEvent);
        this._events.set(IncomingHeader.FURNITURE_STATE, FurnitureStateEvent);
        this._events.set(IncomingHeader.ITEM_DIMMER_SETTINGS, RoomDimmerPresetsEvent);
        this._events.set(IncomingHeader.FURNITURE_STATE_2, FurnitureState2Event);
        this._events.set(IncomingHeader.LOVELOCK_FURNI_FINISHED, LoveLockFurniFinishedEvent);
        this._events.set(IncomingHeader.LOVELOCK_FURNI_FRIEND_COMFIRMED, LoveLockFurniFriendConfirmedEvent);
        this._events.set(IncomingHeader.LOVELOCK_FURNI_START, LoveLockFurniStartEvent);
        this._events.set(IncomingHeader.OBJECTS_DATA_UPDATE, ObjectsDataUpdateEvent);

        // FLOOR
        this._events.set(IncomingHeader.FURNITURE_FLOOR_ADD, FurnitureFloorAddEvent);
        this._events.set(IncomingHeader.FURNITURE_FLOOR, FurnitureFloorEvent);
        this._events.set(IncomingHeader.FURNITURE_FLOOR_REMOVE, FurnitureFloorRemoveEvent);
        this._events.set(IncomingHeader.FURNITURE_FLOOR_UPDATE, FurnitureFloorUpdateEvent);

        // WALL
        this._events.set(IncomingHeader.ITEM_WALL_ADD, FurnitureWallAddEvent);
        this._events.set(IncomingHeader.ITEM_WALL, FurnitureWallEvent);
        this._events.set(IncomingHeader.ITEM_WALL_REMOVE, FurnitureWallRemoveEvent);
        this._events.set(IncomingHeader.ITEM_WALL_UPDATE, FurnitureWallUpdateEvent);

        // MAPPING
        this._events.set(IncomingHeader.ROOM_MODEL_DOOR, RoomDoorEvent);
        this._events.set(IncomingHeader.ROOM_HEIGHT_MAP, RoomHeightMapEvent);
        this._events.set(IncomingHeader.ROOM_HEIGHT_MAP_UPDATE, RoomHeightMapUpdateEvent);
        this._events.set(IncomingHeader.ROOM_MODEL, RoomModelEvent);
        this._events.set(IncomingHeader.ROOM_MODEL_NAME, RoomModelNameEvent);
        this._events.set(IncomingHeader.ROOM_PAINT, RoomPaintEvent);
        this._events.set(IncomingHeader.ROOM_THICKNESS, RoomThicknessEvent);
        this._events.set(IncomingHeader.ROOM_MODEL_BLOCKED_TILES, RoomBlockedTilesEvent);

        // PET
        this._events.set(IncomingHeader.PET_FIGURE_UPDATE, PetFigureUpdateEvent);
        this._events.set(IncomingHeader.PET_INFO, PetInfoEvent);
        this._events.set(IncomingHeader.PET_EXPERIENCE, PetExperienceEvent);

        // SESSION
        this._events.set(IncomingHeader.PLAYING_GAME, YouArePlayingGameEvent);

        // UNIT
        this._events.set(IncomingHeader.UNIT_DANCE, RoomUnitDanceEvent);
        this._events.set(IncomingHeader.UNIT_EFFECT, RoomUnitEffectEvent);
        this._events.set(IncomingHeader.UNIT, RoomUnitEvent);
        this._events.set(IncomingHeader.UNIT_EXPRESSION, RoomUnitExpressionEvent);
        this._events.set(IncomingHeader.UNIT_HAND_ITEM, RoomUnitHandItemEvent);
        this._events.set(IncomingHeader.UNIT_IDLE, RoomUnitIdleEvent);
        this._events.set(IncomingHeader.UNIT_INFO, RoomUnitInfoEvent);
        this._events.set(IncomingHeader.UNIT_NUMBER, RoomUnitNumberEvent);
        this._events.set(IncomingHeader.UNIT_REMOVE, RoomUnitRemoveEvent);
        this._events.set(IncomingHeader.UNIT_STATUS, RoomUnitStatusEvent);
        this._events.set(IncomingHeader.HAND_ITEM_RECEIVED, RoomUnitHandItemReceivedEvent);

        // CHAT
        this._events.set(IncomingHeader.FLOOD_CONTROL, FloodControlEvent);
        this._events.set(IncomingHeader.REMAINING_MUTE, RemainingMuteEvent);
        this._events.set(IncomingHeader.UNIT_CHAT, RoomUnitChatEvent);
        this._events.set(IncomingHeader.UNIT_CHAT_SHOUT, RoomUnitChatShoutEvent);
        this._events.set(IncomingHeader.UNIT_CHAT_WHISPER, RoomUnitChatWhisperEvent);
        this._events.set(IncomingHeader.UNIT_TYPING, RoomUnitTypingEvent);

        // ROOM EVENTS
        this._events.set(IncomingHeader.WIRED_ACTION, WiredFurniActionEvent);
        this._events.set(IncomingHeader.WIRED_CONDITION, WiredFurniConditionEvent);
        this._events.set(IncomingHeader.WIRED_TRIGGER, WiredFurniTriggerEvent);
        this._events.set(IncomingHeader.WIRED_OPEN, WiredOpenEvent);
        this._events.set(IncomingHeader.WIRED_REWARD, WiredRewardResultMessageEvent);
        this._events.set(IncomingHeader.WIRED_SAVE, WiredSaveSuccessEvent);
        this._events.set(IncomingHeader.WIRED_ERROR, WiredValidationErrorEvent);
        this._events.set(IncomingHeader.ROOM_MUTED, RoomMutedEvent);

        // SECURITY
        this._events.set(IncomingHeader.AUTHENTICATED, AuthenticatedEvent);

        // USER
        this._events.set(IncomingHeader.IN_CLIENT_LINK, InClientLinkEvent);
        this._events.set(IncomingHeader.USER_IGNORED, IgnoredUsersEvent);
        this._events.set(IncomingHeader.USER_IGNORED_RESULT, IgnoreResultEvent);

        // BADGES
        this._events.set(IncomingHeader.USER_BADGES, BadgesEvent);
        this._events.set(IncomingHeader.USER_BADGES_ADD, BadgeReceivedEvent);

        // ACCESS
        this._events.set(IncomingHeader.USER_PERKS, UserPerksEvent);
        this._events.set(IncomingHeader.USER_PERMISSIONS, UserPermissionsEvent);

        // DATA
        this._events.set(IncomingHeader.USER_BADGES_CURRENT, UserCurrentBadgesEvent);
        this._events.set(IncomingHeader.USER_FIGURE, UserFigureEvent);
        this._events.set(IncomingHeader.USER_INFO, UserInfoEvent);
        this._events.set(IncomingHeader.UNIT_CHANGE_NAME, UserNameChangeMessageEvent);
        this._events.set(IncomingHeader.USER_SETTINGS, UserSettingsEvent);
        this._events.set(IncomingHeader.USER_PROFILE, UserProfileEvent);
        this._events.set(IncomingHeader.MESSENGER_RELATIONSHIPS, RelationshipStatusInfoEvent);

        // GIFTS
        this._events.set(IncomingHeader.GIFT_OPENED, PresentOpenedMessageEvent);

        // INVENTORY
        this._events.set(IncomingHeader.GIFT_RECEIVER_NOT_FOUND, CatalogGiftUsernameUnavailableEvent);

        // BOTS
        this._events.set(IncomingHeader.USER_BOTS, BotInventoryMessageEvent);
        this._events.set(IncomingHeader.REMOVE_BOT_FROM_INVENTORY, BotRemovedFromInventoryEvent);
        this._events.set(IncomingHeader.ADD_BOT_TO_INVENTORY, BotAddedToInventoryEvent);

        // CURRENCY
        this._events.set(IncomingHeader.USER_CREDITS, UserCreditsEvent);
        this._events.set(IncomingHeader.USER_CURRENCY, UserCurrencyEvent);
        this._events.set(IncomingHeader.USER_CURRENCY_UPDATE, UserCurrencyUpdateEvent);

        // SUBSCRIPTION
        this._events.set(IncomingHeader.USER_SUBSCRIPTION, UserSubscriptionEvent);

        // GAMES
        this._events.set(IncomingHeader.LOAD_GAME_URL, LoadGameUrlEvent);

        // WARDROBE
        this._events.set(IncomingHeader.USER_WARDROBE_PAGE, UserWardrobePageEvent);

        // PETS
        this._events.set(IncomingHeader.USER_PETS, PetInventoryEvent);
        this._events.set(IncomingHeader.USER_PET_REMOVE, PetRemovedFromInventory);
        this._events.set(IncomingHeader.USER_PET_ADD, PetAddedToInventoryEvent);
        this._events.set(IncomingHeader.PET_PLACING_ERROR, PetPlacingErrorEvent);

        // MOD TOOL
        this._events.set(IncomingHeader.MODERATION_USER_INFO, ModtoolUserInfoEvent);
        this._events.set(IncomingHeader.MODERATION_TOPICS, ModtoolCallForHelpTopicsEvent);
        this._events.set(IncomingHeader.MODERATION_TOOL, ModtoolMainEvent);
        this._events.set(IncomingHeader.MODTOOL_VISITED_ROOMS_USER, ModtoolReceivedRoomsUserEvent);

        // MARKETPLACE
        this._events.set(IncomingHeader.MARKETPLACE_SELL_ITEM, MarketplaceSellItemEvent);
        this._events.set(IncomingHeader.MARKETPLACE_CONFIG, MarketplaceConfigEvent);
        this._events.set(IncomingHeader.MARKETPLACE_ITEM_STATS, MarketplaceItemStatsEvent);
        this._events.set(IncomingHeader.MARKETPLACE_OWN_ITEMS, MarketplaceOwnItemsEvent);
        this._events.set(IncomingHeader.MARKETPLACE_CANCEL_SALE, MarketplaceCancelItemEvent);
        this._events.set(IncomingHeader.MARKETPLACE_ITEM_POSTED, MarketplaceItemPostedEvent);
        this._events.set(IncomingHeader.MARKETPLACE_ITEMS_SEARCHED, MarketplaceOffersReceivedEvent);
        this._events.set(IncomingHeader.MARKETPLACE_AFTER_ORDER_STATUS, MarketplaceBuyOfferResultEvent);

        // LANDING VIEW
        this._events.set(IncomingHeader.COMMUNITY_GOAL_VOTE_EVENT, CommunityGoalVoteMessageEvent);
        this._events.set(IncomingHeader.PROMO_ARTICLES, PromoArticlesMessageEvent);

        // QUESTS
        this._events.set(IncomingHeader.COMMUNITY_GOAL_EARNED_PRIZES, CommunityGoalEarnedPrizesMessageEvent);
        this._events.set(IncomingHeader.COMMUNITY_GOAL_PROGRESS, CommunityGoalProgressMessageEvent);
        this._events.set(IncomingHeader.CONCURRENT_USERS_GOAL_PROGRESS, ConcurrentUsersGoalProgressMessageEvent);
        this._events.set(IncomingHeader.QUEST_DAILY, QuestDailyMessageEvent);
        this._events.set(IncomingHeader.QUEST_CANCELLED, QuestCancelledMessageEvent);
        this._events.set(IncomingHeader.QUEST_COMPLETED, QuestCompletedMessageEvent);
        this._events.set(IncomingHeader.COMMUNITY_GOAL_HALL_OF_FAME, CommunityGoalHallOfFameMessageEvent);
        this._events.set(IncomingHeader.EPIC_POPUP, EpicPopupMessageEvent);
        this._events.set(IncomingHeader.SEASONAL_QUESTS, SeasonalQuestsMessageEvent);
        this._events.set(IncomingHeader.QUESTS, QuestsMessageEvent);
        this._events.set(IncomingHeader.QUEST, QuestMessageEvent);

        // CRAFTING
        this._events.set(IncomingHeader.CRAFTABLE_PRODUCTS, CraftableProductsEvent);
        this._events.set(IncomingHeader.CRAFTING_RECIPE, CraftingRecipeEvent);
        this._events.set(IncomingHeader.CRAFTING_RECIPES_AVAILABLE, CraftingRecipesAvailableEvent);
        this._events.set(IncomingHeader.CRAFTING_RESULT, CraftingResultEvent);

        // CAMERA
        this._events.set(IncomingHeader.CAMERA_PUBLISH_STATUS, CameraPublishStatusMessageEvent);
        this._events.set(IncomingHeader.CAMERA_PURCHASE_OK, CameraPurchaseOKMessageEvent);
        this._events.set(IncomingHeader.CAMERA_STORAGE_URL, CameraStorageUrlMessageEvent);
        this._events.set(IncomingHeader.COMPETITION_STATUS, CompetitionStatusMessageEvent);
        this._events.set(IncomingHeader.INIT_CAMERA, InitCameraMessageEvent);
        this._events.set(IncomingHeader.THUMBNAIL_STATUS, ThumbnailStatusMessageEvent);*/
    }

    private registerComposers(): void
    {
        // HANDSHAKE
        this._composers.set(OutgoingHeader.RELEASE_VERSION, ClientReleaseVersionComposer);
        this._composers.set(OutgoingHeader.INIT_DH_HANDSHAKE, InitDhHandshakeComposer);
        this._composers.set(OutgoingHeader.COMPLETE_DH_HANDSHAKE, CompleteDhHandshakeMessageComposer);

        /*// AUTHENTICATION
        this._composers.set(OutgoingHeader.AUTHENTICATION, AuthenticationMessageComposer);

        // CATALOG
        this._composers.set(OutgoingHeader.CATALOG_MODE, CatalogModeComposer);
        this._composers.set(OutgoingHeader.CATALOG_PAGE, CatalogPageComposer);
        this._composers.set(OutgoingHeader.CATALOG_PURCHASE, CatalogPurchaseComposer);
        this._composers.set(OutgoingHeader.CATALOG_PURCHASE_GIFT, CatalogPurchaseGiftComposer);
        this._composers.set(OutgoingHeader.CATALOG_SEARCH, CatalogSearchComposer);
        this._composers.set(OutgoingHeader.CATALOG_CLUB, CatalogRequestVipOffersComposer);
        this._composers.set(OutgoingHeader.CATALOG_CLUB_GIFTS, CatalogRequestVipGiftsComposer);
        this._composers.set(OutgoingHeader.CATALOG_REDEEM_VOUCHER, CatalogRedeemVoucherComposer);
        this._composers.set(OutgoingHeader.LOVELOCK_START_CONFIRM, LoveLockStartConfirmComposer);
        this._composers.set(OutgoingHeader.GROUP_MEMBERSHIPS, CatalogGroupsComposer);
        this._composers.set(OutgoingHeader.GIFT_CONFIG, CatalogRequestGiftConfigurationComposer);
        this._composers.set(OutgoingHeader.CATALOG_SELECT_VIP_GIFT, CatalogSelectClubGiftComposer);
        this._composers.set(OutgoingHeader.CATALOG_REQUESET_PET_BREEDS, CatalogRequestPetBreedsComposer);
        this._composers.set(OutgoingHeader.GET_BONUS_RARE_INFO, GetBonusRareInfoMessageComposer);

        // CLIENT
        this._composers.set(OutgoingHeader.CLIENT_PONG, ClientPongComposer);

        // DESKTOP
        this._composers.set(OutgoingHeader.DESKTOP_VIEW, DesktopViewComposer);

        // FRIENDLIST
        this._composers.set(OutgoingHeader.MESSENGER_ACCEPT, AcceptFriendComposer);
        this._composers.set(OutgoingHeader.MESSENGER_DECLINE, DeclineFriendComposer);
        this._composers.set(OutgoingHeader.FIND_FRIENDS, FindNewFriendsComposer);
        this._composers.set(OutgoingHeader.MESSENGER_FOLLOW, FollowFriendComposer);
        this._composers.set(OutgoingHeader.MESSENGER_UPDATES, FriendListUpdateComposer);
        this._composers.set(OutgoingHeader.MESSENGER_REQUESTS, GetFriendRequestsComposer);
        this._composers.set(OutgoingHeader.MESSENGER_SEARCH, HabboSearchComposer);
        this._composers.set(OutgoingHeader.MESSENGER_INIT, MessengerInitComposer);
        this._composers.set(OutgoingHeader.MESSENGER_REMOVE, RemoveFriendComposer);
        this._composers.set(OutgoingHeader.MESSENGER_REQUEST, RequestFriendComposer);
        this._composers.set(OutgoingHeader.MESSENGER_CHAT, SendMessageComposer);
        this._composers.set(OutgoingHeader.MESSENGER_ROOM_INVITE, SendRoomInviteComposer);
        this._composers.set(OutgoingHeader.MESSENGER_RELATIONSHIPS_UPDATE, SetRelationshipStatusComposer);
        this._composers.set(OutgoingHeader.USER_VISIT, VisitUserComposer);

        // GROUP
        this._composers.set(OutgoingHeader.GROUP_INFO, GroupInformationComposer);
        this._composers.set(OutgoingHeader.GROUP_REQUEST, GroupJoinComposer);
        this._composers.set(OutgoingHeader.GROUP_MEMBER_REMOVE_CONFIRM, GroupConfirmRemoveMemberComposer);
        this._composers.set(OutgoingHeader.GROUP_MEMBER_REMOVE, GroupRemoveMemberComposer);
        this._composers.set(OutgoingHeader.GROUP_MEMBERS, GroupMembersComposer);
        this._composers.set(OutgoingHeader.GROUP_ADMIN_ADD, GroupAdminGiveComposer);
        this._composers.set(OutgoingHeader.GROUP_ADMIN_REMOVE, GroupAdminTakeComposer);
        this._composers.set(OutgoingHeader.GROUP_REQUEST_ACCEPT, GroupMembershipAcceptComposer);
        this._composers.set(OutgoingHeader.GROUP_REQUEST_DECLINE, GroupMembershipDeclineComposer);
        this._composers.set(OutgoingHeader.GROUP_DELETE, GroupDeleteComposer);
        this._composers.set(OutgoingHeader.GROUP_CREATE_OPTIONS, GroupBuyDataComposer);
        this._composers.set(OutgoingHeader.GROUP_PARTS, GroupBadgePartsComposer);
        this._composers.set(OutgoingHeader.GROUP_BUY, GroupBuyComposer);
        this._composers.set(OutgoingHeader.GROUP_SETTINGS, GroupSettingsComposer);
        this._composers.set(OutgoingHeader.GROUP_SAVE_BADGE, GroupSaveBadgeComposer);
        this._composers.set(OutgoingHeader.GROUP_SAVE_COLORS, GroupSaveColorsComposer);
        this._composers.set(OutgoingHeader.GROUP_SAVE_INFORMATION, GroupSaveInformationComposer);
        this._composers.set(OutgoingHeader.GROUP_SAVE_PREFERENCES, GroupSavePreferencesComposer);

        // SECURITY
        this._composers.set(OutgoingHeader.SECURITY_TICKET, SecurityTicketComposer);
        this._composers.set(OutgoingHeader.USER_INFO, InfoRetrieveBaseMessageComposer);

        // NAVIGATOR
        this._composers.set(OutgoingHeader.NAVIGATOR_CATEGORIES, NavigatorCategoriesComposer);
        this._composers.set(OutgoingHeader.NAVIGATOR_INIT, NavigatorInitComposer);
        this._composers.set(OutgoingHeader.NAVIGATOR_SEARCH_CLOSE, NavigatorSearchCloseComposer);
        this._composers.set(OutgoingHeader.NAVIGATOR_SEARCH, NavigatorSearchComposer);
        this._composers.set(OutgoingHeader.NAVIGATOR_SEARCH_OPEN, NavigatorSearchOpenComposer);
        this._composers.set(OutgoingHeader.NAVIGATOR_SEARCH_SAVE, NavigatorSearchSaveComposer);
        this._composers.set(OutgoingHeader.NAVIGATOR_SETTINGS, NavigatorSettingsComposer);
        this._composers.set(OutgoingHeader.NAVIGATOR_SETTINGS_SAVE, NavigatorSettingsSaveComposer);
        this._composers.set(OutgoingHeader.NAVIGATOR_CATEGORY_LIST_MODE, NavigatorCategoryListModeComposer);
        this._composers.set(OutgoingHeader.CONVERT_GLOBAL_ROOM_ID, ConvertGlobalRoomIdMessageComposer);

        // INVENTORY

        //// BADGES
        this._composers.set(OutgoingHeader.USER_BADGES, RequestBadgesComposer);
        this._composers.set(OutgoingHeader.USER_BADGES_CURRENT_UPDATE, SetActivatedBadgesComposer);

        //// BOTS
        this._composers.set(OutgoingHeader.USER_BOTS, GetBotInventoryComposer);

        //// FURNI
        this._composers.set(OutgoingHeader.USER_FURNITURE, FurnitureListComposer);
        this._composers.set(OutgoingHeader.USER_FURNITURE2, FurnitureList2Composer);

        //// MARKETPLACE
        this._composers.set(OutgoingHeader.REQUEST_SELL_ITEM, RequestSellItemComposer);
        this._composers.set(OutgoingHeader.REQUEST_MARKETPLACE_ITEM_STATS, MarketplaceRequesstItemStatsComposer);

        //// PETS
        this._composers.set(OutgoingHeader.USER_PETS, RequestPetsComposer);

        //// TRADING
        this._composers.set(OutgoingHeader.TRADE_ACCEPT, TradingAcceptComposer);
        this._composers.set(OutgoingHeader.TRADE_CANCEL, TradingCancelComposer);
        this._composers.set(OutgoingHeader.TRADE_CLOSE, TradingCloseComposer);
        this._composers.set(OutgoingHeader.TRADE_CONFIRM, TradingConfirmationComposer);
        this._composers.set(OutgoingHeader.TRADE_ITEM, TradingListAddItemComposer);
        this._composers.set(OutgoingHeader.TRADE_ITEMS, TradingListAddItemsComposer);
        this._composers.set(OutgoingHeader.TRADE_ITEM_REMOVE, TradingListItemRemoveComposer);
        this._composers.set(OutgoingHeader.TRADE, TradingOpenComposer);
        this._composers.set(OutgoingHeader.TRADE_UNACCEPT, TradingUnacceptComposer);

        //// UNSEEN
        this._composers.set(OutgoingHeader.UNSEEN_RESET_CATEGORY, UnseenResetCategoryComposer);
        this._composers.set(OutgoingHeader.UNSEEN_RESET_ITEMS, UnseenResetItemsComposer);

        // ACHIVEMENTS
        this._composers.set(OutgoingHeader.ACHIEVEMENT_LIST, RequestAchievementsMessageComposer);

        // PET
        this._composers.set(OutgoingHeader.PET_MOUNT, PetMountComposer);
        this._composers.set(OutgoingHeader.PET_RESPECT, PetRespectComposer);
        this._composers.set(OutgoingHeader.PET_SUPPLEMENT, PetSupplementComposer);
        this._composers.set(OutgoingHeader.REMOVE_PET_SADDLE, RemovePetSaddleComposer);
        this._composers.set(OutgoingHeader.PET_INFO, RequestPetInfoComposer);
        this._composers.set(OutgoingHeader.TOGGLE_PET_BREEDING, TogglePetBreedingComposer);
        this._composers.set(OutgoingHeader.TOGGLE_PET_RIDING, TogglePetRidingComposer);
        this._composers.set(OutgoingHeader.USE_PET_PRODUCT, UsePetProductComposer);

        // ROOM
        this._composers.set(OutgoingHeader.ROOM_CREATE, RoomCreateComposer);

        // ACCESS
        this._composers.set(OutgoingHeader.ROOM_ENTER, RoomEnterComposer);
        this._composers.set(OutgoingHeader.ROOM_DOORBELL, RoomDoorbellAccessComposer);

        // ACTION
        this._composers.set(OutgoingHeader.ROOM_AMBASSADOR_ALERT, RoomAmbassadorAlertComposer);
        this._composers.set(OutgoingHeader.ROOM_BAN_GIVE, RoomBanUserComposer);
        this._composers.set(OutgoingHeader.ROOM_BAN_REMOVE, RoomUnbanUserComposer);
        this._composers.set(OutgoingHeader.ROOM_RIGHTS_GIVE, RoomGiveRightsComposer);
        this._composers.set(OutgoingHeader.ROOM_KICK, RoomKickUserComposer);
        this._composers.set(OutgoingHeader.ROOM_MUTE_USER, RoomMuteUserComposer);
        this._composers.set(OutgoingHeader.ROOM_RIGHTS_REMOVE, RoomTakeRightsComposer);

        this._composers.set(OutgoingHeader.ROOM_LIKE, RoomLikeRoomComposer);
        this._composers.set(OutgoingHeader.ROOM_DELETE, RoomDeleteComposer);
        this._composers.set(OutgoingHeader.ROOM_STAFF_PICK, RoomStaffPickComposer);

        // DATA
        this._composers.set(OutgoingHeader.ROOM_INFO, RoomInfoComposer);
        this._composers.set(OutgoingHeader.ROOM_SETTINGS, RoomSettingsComposer);
        this._composers.set(OutgoingHeader.ROOM_SETTINGS_SAVE, SaveRoomSettingsComposer);
        this._composers.set(OutgoingHeader.ROOM_RIGHTS_LIST, RoomUsersWithRightsComposer);
        this._composers.set(OutgoingHeader.ROOM_BAN_LIST, RoomBannedUsersComposer);

        // BOTS
        this._composers.set(OutgoingHeader.BOT_CONFIGURATION, RequestBotCommandConfigurationComposer);

        // ENGINE
        this._composers.set(OutgoingHeader.GET_ITEM_DATA, GetItemDataComposer);
        this._composers.set(OutgoingHeader.REMOVE_WALL_ITEM, RemoveWallItemComposer);
        this._composers.set(OutgoingHeader.MODIFY_WALL_ITEM_DATA, ModifyWallItemDataComposer);
        this._composers.set(OutgoingHeader.BOT_PLACE, BotPlaceComposer);
        this._composers.set(OutgoingHeader.BOT_PICKUP, BotRemoveComposer);
        this._composers.set(OutgoingHeader.BOT_SKILL_SAVE, BotSkillSaveComposer);
        this._composers.set(OutgoingHeader.PET_PLACE, PetPlaceComposer);
        this._composers.set(OutgoingHeader.PET_MOVE, PetMoveComposer);
        this._composers.set(OutgoingHeader.PET_PICKUP, PetRemoveComposer);

        // FURNITURE
        this._composers.set(OutgoingHeader.FURNITURE_ALIASES, FurnitureAliasesComposer);
        this._composers.set(OutgoingHeader.FURNITURE_GUILD_INFO, FurnitureGuildInfoComposer);
        this._composers.set(OutgoingHeader.FURNITURE_PICKUP, FurniturePickupComposer);
        this._composers.set(OutgoingHeader.FURNITURE_PLACE, FurniturePlaceComposer);
        this._composers.set(OutgoingHeader.ITEM_PAINT, FurniturePlacePaintComposer);
        this._composers.set(OutgoingHeader.FURNITURE_POSTIT_PLACE, FurniturePostItPlaceComposer);

        // FLOOR
        this._composers.set(OutgoingHeader.FURNITURE_FLOOR_UPDATE, FurnitureFloorUpdateComposer);

        // WALL
        this._composers.set(OutgoingHeader.FURNITURE_WALL_UPDATE, FurnitureWallUpdateComposer);

        // Dimmers
        this._composers.set(OutgoingHeader.ITEM_DIMMER_SETTINGS, MoodlightSettingsComposer);
        this._composers.set(OutgoingHeader.ITEM_DIMMER_SAVE, MoodlightSettingsSaveComposer);
        this._composers.set(OutgoingHeader.ITEM_DIMMER_TOGGLE, MoodlightTogggleStateComposer);

        // Toners
        this._composers.set(OutgoingHeader.ROOM_TONER_APPLY, ApplyTonerComposer);

        // LOGIC
        this._composers.set(OutgoingHeader.ITEM_COLOR_WHEEL_CLICK, FurnitureColorWheelComposer);
        this._composers.set(OutgoingHeader.ITEM_DICE_CLICK, FurnitureDiceActivateComposer);
        this._composers.set(OutgoingHeader.ITEM_DICE_CLOSE, FurnitureDiceDeactivateComposer);
        this._composers.set(OutgoingHeader.FURNITURE_MULTISTATE, FurnitureMultiStateComposer);
        this._composers.set(OutgoingHeader.FURNITURE_RANDOMSTATE, FurnitureRandomStateComposer);
        this._composers.set(OutgoingHeader.ITEM_STACK_HELPER, FurnitureStackHeightComposer);
        this._composers.set(OutgoingHeader.FURNITURE_WALL_MULTISTATE, FurnitureWallMultiStateComposer);
        this._composers.set(OutgoingHeader.ONE_WAY_DOOR_CLICK, FurnitureOneWayDoorComposer);
        this._composers.set(OutgoingHeader.ITEM_EXCHANGE_REDEEM, FurnitureExchangeComposer);
        this._composers.set(OutgoingHeader.ITEM_CLOTHING_REDEEM, RedeemItemClothingComposer);
        this._composers.set(OutgoingHeader.ITEM_SAVE_BACKGROUND, RoomAdsUpdateComposer);

        // MAPPING
        this._composers.set(OutgoingHeader.ROOM_MODEL, RoomModelComposer);
        this._composers.set(OutgoingHeader.ROOM_MODEL_BLOCKED_TILES, RoomBlockedTilesComposer);
        this._composers.set(OutgoingHeader.ROOM_MODEL_DOOR, RoomDoorSettingsComposer);
        this._composers.set(OutgoingHeader.ROOM_MODEL_SAVE, RoomModelSaveComposer);

        // UNIT
        this._composers.set(OutgoingHeader.UNIT_ACTION, RoomUnitActionComposer);
        this._composers.set(OutgoingHeader.UNIT_DANCE, RoomUnitDanceComposer);
        this._composers.set(OutgoingHeader.UNIT_DROP_HAND_ITEM, RoomUnitDropHandItemComposer);
        this._composers.set(OutgoingHeader.UNIT_GIVE_HANDITEM, RoomUnitGiveHandItemComposer);
        this._composers.set(OutgoingHeader.UNIT_GIVE_HANDITEM_PET, RoomUnitGiveHandItemPetComposer);
        this._composers.set(OutgoingHeader.UNIT_LOOK, RoomUnitLookComposer);
        this._composers.set(OutgoingHeader.UNIT_SIGN, RoomUnitSignComposer);
        this._composers.set(OutgoingHeader.UNIT_POSTURE, RoomUnitPostureComposer);
        this._composers.set(OutgoingHeader.UNIT_WALK, RoomUnitWalkComposer);

        // CHAT
        this._composers.set(OutgoingHeader.UNIT_CHAT, RoomUnitChatComposer);
        this._composers.set(OutgoingHeader.UNIT_CHAT_SHOUT, RoomUnitChatShoutComposer);
        this._composers.set(OutgoingHeader.USER_SETTINGS_CHAT_STYLE, RoomUnitChatStyleComposer);
        this._composers.set(OutgoingHeader.UNIT_CHAT_WHISPER, RoomUnitChatWhisperComposer);
        this._composers.set(OutgoingHeader.UNIT_TYPING, RoomUnitTypingStartComposer);
        this._composers.set(OutgoingHeader.UNIT_TYPING_STOP, RoomUnitTypingStopComposer);

        // ROOM EVENTS
        this._composers.set(OutgoingHeader.WIRED_APPLY_SNAPSHOT, ApplySnapshotMessageComposer);
        this._composers.set(OutgoingHeader.WIRED_OPEN, OpenMessageComposer);
        this._composers.set(OutgoingHeader.WIRED_ACTION_SAVE, UpdateActionMessageComposer);
        this._composers.set(OutgoingHeader.WIRED_CONDITION_SAVE, UpdateConditionMessageComposer);
        this._composers.set(OutgoingHeader.WIRED_TRIGGER_SAVE, UpdateTriggerMessageComposer);
        this._composers.set(OutgoingHeader.ROOM_MUTE, RoomMuteComposer);

        // USER
        this._composers.set(OutgoingHeader.APPROVE_NAME, ApproveNameMessageComposer);
        this._composers.set(OutgoingHeader.USER_RESPECT, UserRespectComposer);

        // DATA
        this._composers.set(OutgoingHeader.USER_IGNORED, GetIgnoredUsersComposer);
        this._composers.set(OutgoingHeader.USER_IGNORE, IgnoreUserComposer);
        this._composers.set(OutgoingHeader.USER_IGNORE_ID, IgnoreUserIdComposer);
        this._composers.set(OutgoingHeader.USER_UNIGNORE, UnignoreUserComposer);
        this._composers.set(OutgoingHeader.USER_BADGES_CURRENT, UserCurrentBadgesComposer);
        this._composers.set(OutgoingHeader.USER_FIGURE, UserFigureComposer);
        this._composers.set(OutgoingHeader.USER_HOME_ROOM, UserHomeRoomComposer);
        this._composers.set(OutgoingHeader.USER_MOTTO, UserMottoComposer);
        this._composers.set(OutgoingHeader.USER_PROFILE, UserProfileComposer);
        this._composers.set(OutgoingHeader.MESSENGER_RELATIONSHIPS, UserRelationshipsComposer);

        // MANNEQUIN
        this._composers.set(OutgoingHeader.MANNEQUIN_SAVE_NAME, FurnitureMannequinSaveNameComposer);
        this._composers.set(OutgoingHeader.MANNEQUIN_SAVE_LOOK, FurnitureMannequinSaveLookComposer);

        // GIFTS
        this._composers.set(OutgoingHeader.PRESENT_OPEN_PRESENT, OpenPresentComposer);

        // INVENTORY

        // MARKETPLACE
        this._composers.set(OutgoingHeader.MARKETPLACE_CONFIG, MarketplaceRequestComposer);
        this._composers.set(OutgoingHeader.MARKETPLACE_SELL_ITEM, MarketplaceSellItemComposer);
        this._composers.set(OutgoingHeader.MARKETPLACE_REQUEST_OWN_ITEMS, MarketplaceRequestOwnItemsComposer);
        this._composers.set(OutgoingHeader.MARKETPLACE_TAKE_BACK_ITEM, MarketplaceTakeItemBackComposer);
        this._composers.set(OutgoingHeader.MARKETPLACE_REQUEST_OFFERS, MarketplaceRequestOffersComposer);
        this._composers.set(OutgoingHeader.MARKETPLACE_BUY_OFFER, MarketplaceBuyOfferComposer);
        this._composers.set(OutgoingHeader.MARKETPLACE_REDEEM_CREDITS, MarketplaceRedeemCreditsComposer);

        // BOTS
        this._composers.set(OutgoingHeader.USER_BOTS, GetBotInventoryComposer);

        // PETS
        this._composers.set(OutgoingHeader.USER_PETS, RequestPetsComposer);

        // CURRENCY
        this._composers.set(OutgoingHeader.USER_CURRENCY, UserCurrencyComposer);

        // SUBSCRIPTION
        this._composers.set(OutgoingHeader.USER_SUBSCRIPTION, UserSubscriptionComposer);

        // MODTOOL
        this._composers.set(OutgoingHeader.MODTOOL_REQUEST_ROOM_INFO, ModtoolRequestRoomInfoComposer);
        this._composers.set(OutgoingHeader.MODTOOL_CHANGE_ROOM_SETTINGS, ModtoolChangeRoomSettingsComposer);
        this._composers.set(OutgoingHeader.MODTOOL_REQUEST_USER_CHATLOG, ModtoolRequestUserChatlogComposer);
        this._composers.set(OutgoingHeader.MODTOOL_REQUEST_ROOM_CHATLOG, ModtoolRequestRoomChatlogComposer);
        this._composers.set(OutgoingHeader.MOD_TOOL_USER_INFO, ModtoolRequestUserInfoComposer);
        this._composers.set(OutgoingHeader.MODTOOL_SANCTION_ALERT, ModtoolSanctionAlertComposer);
        this._composers.set(OutgoingHeader.MODTOOL_SANCTION_BAN, ModtoolSanctionBanComposer);
        this._composers.set(OutgoingHeader.MODTOOL_SANCTION_KICK, ModtoolSanctionKickComposer);
        this._composers.set(OutgoingHeader.MODTOOL_SANCTION_TRADELOCK, ModtoolSanctionTradelockComposer);
        this._composers.set(OutgoingHeader.MODTOOL_ALERTEVENT, ModtoolEventAlertComposer);
        this._composers.set(OutgoingHeader.MODTOOL_SANCTION_MUTE, ModtoolSanctionMuteComposer);
        this._composers.set(OutgoingHeader.MODTOOL_REQUEST_USER_ROOMS, ModtoolRequestUserRoomsComposer);
        this._composers.set(OutgoingHeader.MODTOOL_ROOM_ALERT, ModtoolRoomAlertComposer);

        // WARDROBE
        this._composers.set(OutgoingHeader.USER_WARDROBE_PAGE, UserWardrobePageComposer);
        this._composers.set(OutgoingHeader.USER_WARDROBE_SAVE, UserWardrobeSaveComposer);

        // SETTINGS
        this._composers.set(OutgoingHeader.USER_SETTINGS_CAMERA, UserSettingsCameraFollowComposer);
        this._composers.set(OutgoingHeader.USER_SETTINGS_OLD_CHAT, UserSettingsOldChatComposer);
        this._composers.set(OutgoingHeader.USER_SETTINGS_INVITES, UserSettingsRoomInvitesComposer);
        this._composers.set(OutgoingHeader.USER_SETTINGS_VOLUME, UserSettingsSoundComposer);

        // LANDING VIEW
        this._composers.set(OutgoingHeader.COMMUNITY_GOAL_VOTE_COMPOSER, CommunityGoalVoteMessageComposer);
        this._composers.set(OutgoingHeader.GET_PROMO_ARTICLES, GetPromoArticlesComposer);

        // QUEST
        this._composers.set(OutgoingHeader.ACCEPT_QUEST, AcceptQuestMessageComposer);
        this._composers.set(OutgoingHeader.ACTIVATE_QUEST, ActivateQuestMessageComposer);
        this._composers.set(OutgoingHeader.CANCEL_QUEST, CancelQuestMessageComposer);
        this._composers.set(OutgoingHeader.FRIEND_REQUEST_QUEST_COMPLETE, FriendRequestQuestCompleteMessageComposer);
        this._composers.set(OutgoingHeader.GET_COMMUNITY_GOAL_EARNED_PRIZES, GetCommunityGoalEarnedPrizesMessageComposer);
        this._composers.set(OutgoingHeader.GET_COMMUNITY_GOAL_HALL_OF_FAME, GetCommunityGoalHallOfFameMessageComposer);
        this._composers.set(OutgoingHeader.GET_COMMUNITY_GOAL_PROGRESS, GetCommunityGoalProgressMessageComposer);
        this._composers.set(OutgoingHeader.GET_CONCURRENT_USERS_GOAL_PROGRESS, GetConcurrentUsersGoalProgressMessageComposer);
        this._composers.set(OutgoingHeader.GET_CONCURRENT_USERS_REWARD, GetConcurrentUsersRewardMessageComposer);
        this._composers.set(OutgoingHeader.GET_DAILY_QUEST, GetDailyQuestMessageComposer);
        this._composers.set(OutgoingHeader.GET_QUESTS, GetQuestsMessageComposer);
        this._composers.set(OutgoingHeader.GET_SEASONAL_QUESTS_ONLY, GetSeasonalQuestsOnlyMessageComposer);
        this._composers.set(OutgoingHeader.OPEN_QUEST_TRACKER, OpenQuestTrackerMessageComposer);
        this._composers.set(OutgoingHeader.REDEEM_COMMUNITY_GOAL_PRIZE, RedeemCommunityGoalPrizeMessageComposer);
        this._composers.set(OutgoingHeader.REJECT_QUEST, RejectQuestMessageComposer);
        this._composers.set(OutgoingHeader.START_CAMPAIGN, StartCampaignMessageComposer);

        // CRAFTING
        this._composers.set(OutgoingHeader.CRAFT, CraftComposer);
        this._composers.set(OutgoingHeader.CRAFT_SECRET, CraftSecretComposer);
        this._composers.set(OutgoingHeader.GET_CRAFTABLE_PRODUCTS, GetCraftableProductsComposer);
        this._composers.set(OutgoingHeader.GET_CRAFTING_RECIPE, GetCraftingRecipeComposer);
        this._composers.set(OutgoingHeader.GET_CRAFTING_RECIPES_AVAILABLE, GetCraftingRecipesAvailableComposer);

        // CAMERA
        this._composers.set(OutgoingHeader.REQUEST_CAMERA_CONFIGURATION, RequestCameraConfigurationComposer);
        this._composers.set(OutgoingHeader.RENDER_ROOM, RenderRoomMessageComposer);
        this._composers.set(OutgoingHeader.RENDER_ROOM_THUMBNAIL, RenderRoomThumbnailMessageComposer);
        this._composers.set(OutgoingHeader.PURCHASE_PHOTO, PurchasePhotoMessageComposer);
        this._composers.set(OutgoingHeader.PUBLISH_PHOTO, PublishPhotoMessageComposer);
        this._composers.set(OutgoingHeader.PHOTO_COMPETITION, PhotoCompetitionMessageComposer);*/
    }

    public get events(): Map<number, Function>
    {
        return this._events;
    }

    public get composers(): Map<number, Function>
    {
        return this._composers;
    }
}
