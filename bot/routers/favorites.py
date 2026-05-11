from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from api import api
from keyboards.inline import favorites_keyboard, main_menu_keyboard
from routers.start import ensure_auth, token_store

router = Router()


async def show_favorites(event: Message | CallbackQuery):
    user_id = event.from_user.id
    token = token_store.get(user_id)
    if not token:
        token = await ensure_auth(user_id, event.from_user.full_name)

    favs = await api.get_favorites(token)

    if not favs:
        text = "❤️ <b>Избранное пусто.</b>\nДобавляй варианты кнопкой ❤️ после рандомайзера."
        markup = main_menu_keyboard()
    else:
        text = "❤️ <b>Избранное</b>\nНажми на вариант чтобы удалить:"
        markup = favorites_keyboard(favs)

    if isinstance(event, CallbackQuery):
        await event.message.edit_text(text, parse_mode="HTML", reply_markup=markup)
        await event.answer()
    else:
        await event.answer(text, parse_mode="HTML", reply_markup=markup)


@router.message(Command("favorites"))
async def cmd_favorites(message: Message):
    await show_favorites(message)


@router.callback_query(F.data.startswith("unfav:"))
async def on_unfavorite(callback: CallbackQuery):
    item_id = int(callback.data.split(":")[1])
    token = token_store.get(callback.from_user.id)
    if token:
        try:
            await api.remove_favorite(item_id, token)
            await callback.answer("Удалено из избранного")
            await show_favorites(callback)
        except Exception:
            await callback.answer("Ошибка при удалении")
    else:
        await callback.answer("Сначала запусти /start")
