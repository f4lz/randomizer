from vkbottle.bot import BotLabeler, Message
from api import api
from keyboards.inline import main_menu_keyboard
from routers.start import ensure_auth, token_store

labeler = BotLabeler()


async def send_history(peer_id: int, ctx_api):
    token = token_store.get(peer_id)
    if not token:
        token = await ensure_auth(peer_id, ctx_api)

    records = await api.get_history(token)

    if not records:
        text = "История пуста. Запусти рандомайзер!"
    else:
        lines = ["Последние выборы:\n"]
        for rec in records[:10]:
            item = rec.get("item", {})
            cat = item.get("category", {})
            name = item.get("name", "?")
            cat_name = cat.get("name", "")
            created = rec.get("created_at", "")[:10]
            lines.append(f"- {name} [{cat_name}] — {created}")
        text = "\n".join(lines)

    await ctx_api.messages.send(
        peer_id=peer_id,
        message=text,
        keyboard=main_menu_keyboard(),
        random_id=0,
    )


@labeler.message(payload={"cmd": "history"})
async def handle_history(message: Message):
    await send_history(message.peer_id, message.ctx_api)
