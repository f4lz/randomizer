import json
from vkbottle.bot import BotLabeler, Message
from api import api
from keyboards.inline import favorites_keyboard, main_menu_keyboard
from routers.start import ensure_auth, token_store
from rules import PayloadCmd

labeler = BotLabeler()

# vk_id -> last loaded favorites list
last_favs: dict[int, list] = {}


async def send_favorites(peer_id: int, ctx_api):
    token = token_store.get(peer_id) or await ensure_auth(peer_id, ctx_api)
    favs = await api.get_favorites(token)
    last_favs[peer_id] = favs

    if not favs:
        await ctx_api.messages.send(
            peer_id=peer_id,
            message="Избранное пусто. Добавляй варианты кнопкой после рандомайзера.",
            keyboard=main_menu_keyboard(),
            random_id=0,
        )
    else:
        await ctx_api.messages.send(
            peer_id=peer_id,
            message="Избранное. Нажми на вариант чтобы удалить:",
            keyboard=favorites_keyboard(favs),
            random_id=0,
        )


@labeler.message(payload={"cmd": "favorites"})
async def handle_favorites(message: Message):
    await send_favorites(message.peer_id, message.ctx_api)


@labeler.message(PayloadCmd("unfav"))
async def handle_unfav(message: Message):
    user_id = message.from_id
    token = token_store.get(user_id)
    p = json.loads(message.payload) if isinstance(message.payload, str) else (message.payload or {})
    idx = p.get("idx")
    favs = last_favs.get(user_id, [])

    if not token or idx is None or idx >= len(favs):
        await message.answer("Ошибка. Обнови список избранного.", keyboard=main_menu_keyboard())
        return

    item_id = favs[idx].get("item", {}).get("id")
    try:
        await api.remove_favorite(item_id, token)
        await send_favorites(message.peer_id, message.ctx_api)
    except Exception:
        await message.answer("Ошибка при удалении.", keyboard=main_menu_keyboard())
