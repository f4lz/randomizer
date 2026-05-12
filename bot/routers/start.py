from vkbottle.bot import BotLabeler, Message
from api import api
from keyboards.inline import main_menu_keyboard

labeler = BotLabeler()

# vk_id -> JWT token cache
token_store: dict[int, str] = {}


async def ensure_auth(vk_id: int, ctx_api=None) -> str:
    """Return cached token or authenticate via backend."""
    if vk_id not in token_store:
        name = ""
        if ctx_api:
            try:
                users = await ctx_api.users.get([vk_id])
                if users:
                    name = f"{users[0].first_name} {users[0].last_name}".strip()
            except Exception:
                pass
        result = await api.login_vk(vk_id, name)
        token_store[vk_id] = result["access_token"]
    return token_store[vk_id]


@labeler.message(text=["начать", "старт", "start", "/start", "привет"])
@labeler.message(payload={"command": "start"})
async def cmd_start(message: Message):
    await ensure_auth(message.from_id, message.ctx_api)
    await message.answer(
        "Привет! Я помогу тебе выбрать, когда сделать выбор сложно.\n"
        "Выбери действие:",
        keyboard=main_menu_keyboard(),
    )


@labeler.message(payload={"cmd": "menu"})
async def cmd_menu(message: Message):
    await message.answer("Главное меню:", keyboard=main_menu_keyboard())
