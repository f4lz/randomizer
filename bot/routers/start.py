from aiogram import Router
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery
from api import api
from keyboards.inline import main_menu_keyboard

router = Router()

# Storage: telegram_id → access_token (in-memory, sufficient for diploma scope)
token_store: dict[int, str] = {}


async def ensure_auth(user_id: int, full_name: str) -> str:
    """Return cached token or authenticate via backend."""
    if user_id not in token_store:
        result = await api.login_telegram(user_id, full_name)
        token_store[user_id] = result["access_token"]
    return token_store[user_id]


@router.message(CommandStart())
async def cmd_start(message: Message):
    token = await ensure_auth(message.from_user.id, message.from_user.full_name)
    await message.answer(
        f"👋 Привет, <b>{message.from_user.first_name}</b>!\n\n"
        "Я помогу тебе выбрать, когда сделать выбор сложно 🎲\n"
        "Выбери действие:",
        parse_mode="HTML",
        reply_markup=main_menu_keyboard(),
    )


@router.message(Command("menu"))
async def cmd_menu(message: Message):
    await ensure_auth(message.from_user.id, message.from_user.full_name)
    await message.answer("Главное меню:", reply_markup=main_menu_keyboard())


@router.callback_query(lambda c: c.data == "menu:spin")
async def menu_spin(callback: CallbackQuery):
    from routers.spin import show_categories
    await show_categories(callback)


@router.callback_query(lambda c: c.data == "menu:history")
async def menu_history(callback: CallbackQuery):
    from routers.history import show_history
    await show_history(callback)


@router.callback_query(lambda c: c.data == "menu:favorites")
async def menu_favorites(callback: CallbackQuery):
    from routers.favorites import show_favorites
    await show_favorites(callback)


@router.callback_query(lambda c: c.data == "menu:add")
async def menu_add(callback: CallbackQuery):
    from routers.items import show_add_categories
    await show_add_categories(callback)
