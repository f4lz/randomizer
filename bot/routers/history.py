from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery
from api import api
from keyboards.inline import main_menu_keyboard
from routers.start import ensure_auth, token_store

router = Router()


async def show_history(event: Message | CallbackQuery):
    user_id = event.from_user.id
    token = token_store.get(user_id)
    if not token:
        token = await ensure_auth(user_id, event.from_user.full_name)

    records = await api.get_history(token)

    if not records:
        text = "📋 <b>История пуста.</b>\nЗапусти рандомайзер командой /spin!"
    else:
        lines = ["📋 <b>Последние выборы:</b>\n"]
        for rec in records[:10]:
            item = rec.get("item", {})
            cat = item.get("category", {})
            name = item.get("name", "?")
            cat_name = cat.get("name", "")
            created = rec.get("created_at", "")[:10]
            lines.append(f"• <b>{name}</b> [{cat_name}] — {created}")
        text = "\n".join(lines)

    markup = main_menu_keyboard()
    if isinstance(event, CallbackQuery):
        await event.message.edit_text(text, parse_mode="HTML", reply_markup=markup)
        await event.answer()
    else:
        await event.answer(text, parse_mode="HTML", reply_markup=markup)


@router.message(Command("history"))
async def cmd_history(message: Message):
    await show_history(message)
