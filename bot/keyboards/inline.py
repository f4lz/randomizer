from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder


def categories_keyboard(categories: list[dict], prefix: str = "cat") -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    for cat in categories:
        builder.button(
            text=f"{cat['icon']} {cat['name']}",
            callback_data=f"{prefix}:{cat['id']}",
        )
    builder.adjust(2)
    return builder.as_markup()


def spin_result_keyboard(item_id: int, history_id: int, category_id: int) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="🔄 Ещё раз", callback_data=f"spin_again:{item_id}")
    builder.button(text="❤️ В избранное", callback_data=f"fav:{item_id}")
    builder.button(text="🚫 Не этот", callback_data=f"exc:{item_id}")
    builder.button(text="✨ ИИ подсказка", callback_data=f"ai:{history_id}")
    builder.button(text="🧠 Придумай идею", callback_data=f"genidea:{category_id}")
    builder.adjust(2)
    return builder.as_markup()


def generate_idea_keyboard(category_id: int) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="🔄 Ещё идею", callback_data=f"genidea:{category_id}")
    builder.button(text="🎲 Случайный выбор", callback_data=f"cat:{category_id}")
    builder.button(text="🏠 Меню", callback_data="menu:spin")
    builder.adjust(2)
    return builder.as_markup()


def favorites_keyboard(favorites: list[dict]) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    for fav in favorites:
        item = fav.get("item", {})
        builder.button(
            text=f"🗑 {item.get('name', '?')}",
            callback_data=f"unfav:{item.get('id')}",
        )
    builder.adjust(1)
    return builder.as_markup()


def main_menu_keyboard() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="🎲 Рандомайзер", callback_data="menu:spin")
    builder.button(text="📋 История", callback_data="menu:history")
    builder.button(text="❤️ Избранное", callback_data="menu:favorites")
    builder.button(text="➕ Добавить вариант", callback_data="menu:add")
    builder.adjust(2)
    return builder.as_markup()
