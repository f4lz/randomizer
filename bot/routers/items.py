from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, CallbackQuery
from api import api
from keyboards.inline import categories_keyboard, main_menu_keyboard
from routers.start import ensure_auth, token_store

router = Router()


class AddItemForm(StatesGroup):
    waiting_for_name = State()


# Temporary: store chosen category during FSM
pending_category: dict[int, int] = {}


async def show_add_categories(event: Message | CallbackQuery):
    user_id = event.from_user.id
    token = token_store.get(user_id)
    if not token:
        token = await ensure_auth(user_id, event.from_user.full_name)

    categories = await api.get_categories(token)
    text = "➕ <b>Добавить вариант</b>\nВыбери категорию:"
    markup = categories_keyboard(categories, prefix="addcat")

    if isinstance(event, CallbackQuery):
        await event.message.edit_text(text, parse_mode="HTML", reply_markup=markup)
        await event.answer()
    else:
        await event.answer(text, parse_mode="HTML", reply_markup=markup)


@router.message(Command("add"))
async def cmd_add(message: Message):
    await show_add_categories(message)


@router.callback_query(F.data.startswith("addcat:"))
async def on_add_category_selected(callback: CallbackQuery, state: FSMContext):
    category_id = int(callback.data.split(":")[1])
    pending_category[callback.from_user.id] = category_id
    await state.set_state(AddItemForm.waiting_for_name)
    await callback.message.edit_text(
        "✏️ Введи название варианта:",
        reply_markup=None,
    )
    await callback.answer()


@router.message(AddItemForm.waiting_for_name)
async def on_item_name_received(message: Message, state: FSMContext):
    user_id = message.from_user.id
    token = token_store.get(user_id)
    category_id = pending_category.get(user_id)

    if not token or not category_id:
        await message.answer("Что-то пошло не так. Начни снова с /add")
        await state.clear()
        return

    name = message.text.strip()
    if not name:
        await message.answer("Название не может быть пустым. Попробуй ещё раз:")
        return

    try:
        await api.create_item(name, category_id, token)
        await message.answer(
            f"✅ Вариант <b>{name}</b> добавлен!",
            parse_mode="HTML",
            reply_markup=main_menu_keyboard(),
        )
    except Exception:
        await message.answer("Ошибка при добавлении. Попробуй ещё раз.")

    await state.clear()
    pending_category.pop(user_id, None)
