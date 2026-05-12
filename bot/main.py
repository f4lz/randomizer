import logging

from vkbottle.bot import Bot
from config import settings
from routers import start, spin, history, favorites, items

logging.basicConfig(level=logging.DEBUG)

bot = Bot(token=settings.BOT_TOKEN)

bot.labeler.load(start.labeler)
bot.labeler.load(spin.labeler)
bot.labeler.load(history.labeler)
bot.labeler.load(favorites.labeler)
bot.labeler.load(items.labeler)


if __name__ == "__main__":
    bot.loop_wrapper.add_task(bot.run_polling())
    bot.loop_wrapper.run()
