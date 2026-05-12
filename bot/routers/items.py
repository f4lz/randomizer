import json
from vkbottle.bot import BotLabeler, Message
from api import api
from keyboards.inline import categories_keyboard, main_menu_keyboard
from routers.start import ensure_auth, token_store
from rules import PayloadCmd

labeler = BotLabeler()

# vk_id -> category_id while waiting for item name input
pending_category: dict[int, int] = {}


@labeler.message(payload={"cmd": "add"})
async def handle_add(message: Message):
    token = token_store.get(message.peer_id) or await ensure_auth(message.peer_id, message.ctx_api)
    categories = await api.get_categories(token)
    await message.answer(
        "Добавить вариант. Выбери категорию:",
        keyboard=categories_keyboard(categories, prefix="addcat"),
    )


@labeler.message(PayloadCmd("addcat"))
async def handle_addcat(message: Message):
    user_id = message.from_id
    p = json.loads(message.payload) if isinstance(message.payload, str) else (message.payload or {})
    category_id = p.get("id")
    pending_category[user_id] = category_id
    await message.answer("Введи название варианта:")


@labeler.message()
async def handle_text_input(message: Message):
    """Fallback handler: catches item name input when user has a pending category."""
    import logging
    logging.getLogger(__name__).info("MSG text=%r payload=%r from=%s", message.text, message.payload, message.from_id)
    user_id = message.from_id
    if user_id not in pending_category:
        return

    token = token_store.get(user_id)
    category_id = pending_category.get(user_id)

    if not token or not category_id:
        await message.answer("Что-то пошло не так. Начни снова.", keyboard=main_menu_keyboard())
        pending_category.pop(user_id, None)
        return

    name = message.text.strip()
    if not name:
        await message.answer("Название не может быть пустым. Введи ещё раз:")
        return

    try:
        await api.create_item(name, category_id, token)
        await message.answer(f"Вариант '{name}' добавлен!", keyboard=main_menu_keyboard())
    except Exception:
        await message.answer("Ошибка при добавлении. Попробуй ещё раз.", keyboard=main_menu_keyboard())

    pending_category.pop(user_id, None)
