import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

from config import settings
from api import api
from routers import start, spin, history, favorites, items

logging.basicConfig(level=logging.INFO)


async def main():
    bot = Bot(token=settings.BOT_TOKEN)
    dp = Dispatcher(storage=MemoryStorage())

    # Register routers (order matters: start last to avoid catching other callbacks)
    dp.include_router(spin.router)
    dp.include_router(history.router)
    dp.include_router(favorites.router)
    dp.include_router(items.router)
    dp.include_router(start.router)

    try:
        await dp.start_polling(bot, skip_updates=True)
    finally:
        await api.close()
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
