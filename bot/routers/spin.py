import json
import logging
from vkbottle.bot import BotLabeler, Message
from api import api
from keyboards.inline import (
    categories_keyboard,
    spin_result_keyboard,
    generate_idea_keyboard,
    main_menu_keyboard,
)
from routers.start import ensure_auth, token_store
from rules import PayloadCmd

logger = logging.getLogger(__name__)
labeler = BotLabeler()


def strip_md(text: str) -> str:
    import re
    text = re.sub(r'\*{1,3}(.+?)\*{1,3}', r'\1', text)
    text = re.sub(r'#{1,6}\s*', '', text)
    text = re.sub(r'`{1,3}', '', text)
    return text.strip()


def get_payload(message: Message) -> dict:
    p = message.payload
    if isinstance(p, str):
        try:
            return json.loads(p)
        except Exception:
            return {}
    return p or {}

# vk_id -> last spin result
last_spin: dict[int, dict] = {}
# vk_id -> last category_id
last_category: dict[int, int] = {}
# category_id -> category name cache
category_names: dict[int, str] = {}
# vk_id -> last generated idea text
last_idea: dict[int, str] = {}


async def do_spin(user_id: int, category_id: int, token: str, peer_id: int, ctx_api):
    last_category[user_id] = category_id
    try:
        result = await api.spin(category_id, token)
        item = result["item"]
        history_id = result["history_id"]
        last_spin[user_id] = {"item_id": item["id"], "history_id": history_id, "category_id": category_id}
        await ctx_api.messages.send(
            peer_id=peer_id,
            message=f"🎲 Результат:\n\n{item['name']}\n\nЧто дальше?",
            keyboard=spin_result_keyboard(category_id),
            random_id=0,
        )
    except Exception as e:
        logger.exception("Spin error: %s", e)
        await ctx_api.messages.send(
            peer_id=peer_id,
            message="Нет доступных вариантов в этой категории. Добавь варианты.",
            keyboard=main_menu_keyboard(),
            random_id=0,
        )


@labeler.message(payload={"cmd": "spin"})
async def handle_spin_menu(message: Message):
    token = token_store.get(message.peer_id) or await ensure_auth(message.peer_id, message.ctx_api)
    categories = await api.get_categories(token)
    for cat in categories:
        category_names[cat["id"]] = cat["name"]
    await message.answer("Выбери категорию:", keyboard=categories_keyboard(categories))


@labeler.message(PayloadCmd("cat"))
async def handle_cat(message: Message):
    category_id = get_payload(message).get("id")
    user_id = message.from_id
    token = token_store.get(user_id) or await ensure_auth(user_id, message.ctx_api)
    await do_spin(user_id, category_id, token, message.peer_id, message.ctx_api)


@labeler.message(PayloadCmd("spin_again"))
async def handle_spin_again(message: Message):
    user_id = message.from_id
    category_id = get_payload(message).get("cid") or last_category.get(user_id)
    if not category_id:
        await message.answer("Сначала выбери категорию.", keyboard=main_menu_keyboard())
        return
    token = token_store.get(user_id) or await ensure_auth(user_id, message.ctx_api)
    await do_spin(user_id, category_id, token, message.peer_id, message.ctx_api)


@labeler.message(payload={"cmd": "fav"})
async def handle_fav(message: Message):
    user_id = message.from_id
    token = token_store.get(user_id)
    spin = last_spin.get(user_id)
    if not token or not spin:
        await message.answer("Сначала сделай рандомный выбор.", keyboard=main_menu_keyboard())
        return
    try:
        await api.add_favorite(spin["item_id"], token)
        await message.answer("❤️ Добавлено в избранное!", keyboard=spin_result_keyboard(spin["category_id"]))
    except Exception:
        await message.answer("Уже в избранном или ошибка.", keyboard=spin_result_keyboard(spin["category_id"]))


@labeler.message(payload={"cmd": "exc"})
async def handle_exc(message: Message):
    user_id = message.from_id
    token = token_store.get(user_id)
    spin = last_spin.get(user_id)
    if not token or not spin:
        await message.answer("Сначала сделай рандомный выбор.", keyboard=main_menu_keyboard())
        return
    await api.add_excluded(spin["item_id"], token)
    await do_spin(user_id, spin["category_id"], token, message.peer_id, message.ctx_api)


@labeler.message(payload={"cmd": "ai"})
async def handle_ai(message: Message):
    user_id = message.from_id
    token = token_store.get(user_id)
    spin = last_spin.get(user_id)
    if not token or not spin:
        await message.answer("Сначала сделай рандомный выбор.", keyboard=main_menu_keyboard())
        return
    await message.answer("Генерирую подсказку...")
    try:
        result = await api.get_ai(spin["history_id"], token)
        ai_text = strip_md(result.get("text", "Нет ответа"))
        await message.answer(f"💡 ИИ советует:\n{ai_text}", keyboard=spin_result_keyboard(spin["category_id"]))
    except Exception:
        await message.answer("Не удалось получить ИИ подсказку.", keyboard=main_menu_keyboard())


@labeler.message(PayloadCmd("addidea"))
async def handle_addidea(message: Message):
    user_id = message.from_id
    category_id = get_payload(message).get("cid") or last_category.get(user_id)
    token = token_store.get(user_id)
    idea = last_idea.get(user_id)
    if not token or not idea or not category_id:
        await message.answer("Нет идеи для добавления.", keyboard=main_menu_keyboard())
        return
    try:
        await api.create_item(idea, category_id, token)
        last_idea.pop(user_id, None)
        await message.answer(f"Вариант добавлен: {idea}", keyboard=main_menu_keyboard())
    except Exception:
        await message.answer("Ошибка при добавлении.", keyboard=main_menu_keyboard())


@labeler.message(PayloadCmd("genidea"))
async def handle_genidea(message: Message):
    user_id = message.from_id
    category_id = get_payload(message).get("cid") or last_category.get(user_id)
    token = token_store.get(user_id) or await ensure_auth(user_id, message.ctx_api)
    cat_name = category_names.get(category_id, "")
    if not cat_name:
        try:
            categories = await api.get_categories(token)
            for cat in categories:
                category_names[cat["id"]] = cat["name"]
            cat_name = category_names.get(category_id, "")
        except Exception:
            pass
    await message.answer("Придумываю идею...")
    try:
        idea = strip_md(await api.generate_idea(cat_name, token))
        last_idea[user_id] = idea
        await message.answer(f"✨ Идея от ИИ:\n\n{idea}", keyboard=generate_idea_keyboard(category_id))
    except Exception:
        await message.answer("Не удалось сгенерировать идею.", keyboard=main_menu_keyboard())
