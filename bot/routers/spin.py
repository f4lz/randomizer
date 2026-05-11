from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from api import api
from keyboards.inline import (
    categories_keyboard, spin_result_keyboard,
    generate_idea_keyboard, main_menu_keyboard,
)
from routers.start import ensure_auth, token_store

router = Router()

# Temporary state: last category per user
last_category: dict[int, int] = {}
# category_id → category_name cache (filled on first categories fetch)
category_names: dict[int, str] = {}


async def show_categories(event: Message | CallbackQuery):
    user_id = event.from_user.id
    token = await ensure_auth(user_id, event.from_user.full_name)
    categories = await api.get_categories(token)

    for cat in categories:
        category_names[cat["id"]] = cat["name"]

    text = "🎲 <b>Выбери категорию:</b>"
    markup = categories_keyboard(categories)

    if isinstance(event, CallbackQuery):
        await event.message.edit_text(text, parse_mode="HTML", reply_markup=markup)
        await event.answer()
    else:
        await event.answer(text, parse_mode="HTML", reply_markup=markup)


@router.message(Command("spin"))
async def cmd_spin(message: Message):
    await show_categories(message)


@router.callback_query(F.data.startswith("cat:"))
async def on_category_selected(callback: CallbackQuery):
    category_id = int(callback.data.split(":")[1])
    user_id = callback.from_user.id
    token = token_store.get(user_id)
    if not token:
        token = await ensure_auth(user_id, callback.from_user.full_name)

    last_category[user_id] = category_id

    try:
        result = await api.spin(category_id, token)
        item = result["item"]
        history_id = result["history_id"]

        await callback.message.edit_text(
            f"🎲 <b>Результат:</b>\n\n"
            f"<b>{item['name']}</b>\n\n"
            f"Что дальше?",
            parse_mode="HTML",
            reply_markup=spin_result_keyboard(item["id"], history_id, category_id),
        )
    except Exception:
        await callback.message.edit_text(
            "😔 Нет доступных вариантов в этой категории.\n"
            "Добавь варианты командой /add",
            reply_markup=main_menu_keyboard(),
        )
    await callback.answer()


@router.callback_query(F.data.startswith("spin_again:"))
async def on_spin_again(callback: CallbackQuery):
    user_id = callback.from_user.id
    category_id = last_category.get(user_id)
    if not category_id:
        await callback.answer("Сначала выбери категорию через /spin")
        return
    callback.data = f"cat:{category_id}"
    await on_category_selected(callback)


@router.callback_query(F.data.startswith("fav:"))
async def on_favorite(callback: CallbackQuery):
    item_id = int(callback.data.split(":")[1])
    token = token_store.get(callback.from_user.id)
    if token:
        try:
            await api.add_favorite(item_id, token)
            await callback.answer("❤️ Добавлено в избранное!")
        except Exception:
            await callback.answer("Уже в избранном или ошибка")
    else:
        await callback.answer("Сначала запусти /start")


@router.callback_query(F.data.startswith("exc:"))
async def on_exclude(callback: CallbackQuery):
    item_id = int(callback.data.split(":")[1])
    token = token_store.get(callback.from_user.id)
    if token:
        await api.add_excluded(item_id, token)
        await callback.answer("🚫 Вариант временно исключён")
        user_id = callback.from_user.id
        category_id = last_category.get(user_id)
        if category_id:
            callback.data = f"cat:{category_id}"
            await on_category_selected(callback)
    else:
        await callback.answer("Сначала запусти /start")


@router.callback_query(F.data.startswith("ai:"))
async def on_ai(callback: CallbackQuery):
    history_id = int(callback.data.split(":")[1])
    token = token_store.get(callback.from_user.id)
    if not token:
        await callback.answer("Сначала запусти /start")
        return

    await callback.answer("✨ Генерирую подсказку...")
    try:
        result = await api.get_ai(history_id, token)
        ai_text = result.get("text", "Нет ответа")
        await callback.message.edit_text(
            callback.message.text + f"\n\n✨ <b>ИИ советует:</b>\n{ai_text}",
            parse_mode="HTML",
            reply_markup=callback.message.reply_markup,
        )
    except Exception:
        await callback.message.answer("Не удалось получить ИИ подсказку")


@router.callback_query(F.data.startswith("genidea:"))
async def on_generate_idea(callback: CallbackQuery):
    category_id = int(callback.data.split(":")[1])
    user_id = callback.from_user.id
    token = token_store.get(user_id)
    if not token:
        token = await ensure_auth(user_id, callback.from_user.full_name)

    cat_name = category_names.get(category_id, "")
    if not cat_name:
        # Refresh categories if name not cached
        categories = await api.get_categories(token)
        for cat in categories:
            category_names[cat["id"]] = cat["name"]
        cat_name = category_names.get(category_id, "")

    await callback.answer("🧠 Придумываю идею...")
    try:
        idea = await api.generate_idea(cat_name, token)
        await callback.message.edit_text(
            f"🧠 <b>Идея от ИИ:</b>\n\n{idea}",
            parse_mode="HTML",
            reply_markup=generate_idea_keyboard(category_id),
        )
    except Exception:
        await callback.message.answer("Не удалось сгенерировать идею")
