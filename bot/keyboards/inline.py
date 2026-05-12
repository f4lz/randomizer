from vkbottle import Keyboard, Text

ICON_EMOJI = {
    "UtensilsCrossed": "🍽️",
    "MapPin": "📍",
    "Clapperboard": "🎬",
    "Target": "🎯",
    "Rocket": "🚀",
}


def icon_to_emoji(name: str) -> str:
    return ICON_EMOJI.get(name, "")


def main_menu_keyboard() -> str:
    kb = Keyboard(one_time=False)
    kb.add(Text("Рандомайзер", {"cmd": "spin"}))
    kb.add(Text("История", {"cmd": "history"}))
    kb.row()
    kb.add(Text("Избранное", {"cmd": "favorites"}))
    kb.add(Text("Добавить вариант", {"cmd": "add"}))
    return kb.get_json()


def categories_keyboard(categories: list[dict], prefix: str = "cat") -> str:
    kb = Keyboard(one_time=True)
    for i, cat in enumerate(categories):
        label = f"{icon_to_emoji(cat.get('icon', ''))} {cat['name']}".strip()
        kb.add(Text(label, {"cmd": prefix, "id": cat["id"]}))
        if i % 2 == 1:
            kb.row()
    return kb.get_json()


def spin_result_keyboard(category_id: int) -> str:
    kb = Keyboard(one_time=False)
    kb.add(Text("🔄 Ещё раз", {"cmd": "spin_again", "cid": category_id}))
    kb.add(Text("❤️ В избранное", {"cmd": "fav"}))
    kb.row()
    kb.add(Text("🚫 Не этот", {"cmd": "exc"}))
    kb.add(Text("💡 ИИ подсказка", {"cmd": "ai"}))
    kb.row()
    kb.add(Text("✨ Придумай идею", {"cmd": "genidea", "cid": category_id}))
    kb.add(Text("🏠 Меню", {"cmd": "menu"}))
    return kb.get_json()


def generate_idea_keyboard(category_id: int) -> str:
    kb = Keyboard(one_time=False)
    kb.add(Text("➕ Добавить в варианты", {"cmd": "addidea", "cid": category_id}))
    kb.row()
    kb.add(Text("🔄 Ещё идею", {"cmd": "genidea", "cid": category_id}))
    kb.add(Text("🎲 Случайный выбор", {"cmd": "spin_again", "cid": category_id}))
    kb.row()
    kb.add(Text("🏠 Меню", {"cmd": "menu"}))
    return kb.get_json()


def favorites_keyboard(favorites: list[dict]) -> str:
    kb = Keyboard(one_time=False)
    for i, fav in enumerate(favorites):
        item = fav.get("item", {})
        name = item.get("name", "?")[:25]
        kb.add(Text(f"❌ {name}", {"cmd": "unfav", "idx": i}))
        kb.row()
    kb.add(Text("🏠 Меню", {"cmd": "menu"}))
    return kb.get_json()
