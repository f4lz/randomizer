import aiohttp
from config import settings


class ApiClient:
    def __init__(self):
        self.base = settings.API_URL
        self._session: aiohttp.ClientSession | None = None

    async def _get_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session

    async def close(self):
        if self._session and not self._session.closed:
            await self._session.close()

    def _headers(self, token: str | None = None) -> dict:
        h = {"Content-Type": "application/json"}
        if token:
            h["Authorization"] = f"Bearer {token}"
        return h

    # ── Auth ──────────────────────────────────────────────────────────────

    async def login_telegram(self, telegram_id: int, name: str) -> dict:
        """Register or login via Telegram ID, returns {access_token, user}."""
        session = await self._get_session()
        async with session.post(
            f"{self.base}/auth/telegram",
            json={"telegram_id": telegram_id, "name": name},
            headers=self._headers(),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()

    # ── Categories ────────────────────────────────────────────────────────

    async def get_categories(self, token: str) -> list[dict]:
        session = await self._get_session()
        async with session.get(
            f"{self.base}/categories",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()

    async def get_category_items(self, category_id: int, token: str) -> list[dict]:
        session = await self._get_session()
        async with session.get(
            f"{self.base}/categories/{category_id}/items",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()

    # ── Spin ──────────────────────────────────────────────────────────────

    async def spin(self, category_id: int, token: str) -> dict:
        session = await self._get_session()
        async with session.post(
            f"{self.base}/spin/{category_id}",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()

    async def get_ai(self, history_id: int, token: str) -> dict:
        session = await self._get_session()
        async with session.post(
            f"{self.base}/spin/{history_id}/ai",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()

    async def get_history(self, token: str) -> list[dict]:
        session = await self._get_session()
        async with session.get(
            f"{self.base}/spin/history",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()

    # ── Favorites ─────────────────────────────────────────────────────────

    async def get_favorites(self, token: str) -> list[dict]:
        session = await self._get_session()
        async with session.get(
            f"{self.base}/favorites",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()

    async def add_favorite(self, item_id: int, token: str) -> dict:
        session = await self._get_session()
        async with session.post(
            f"{self.base}/favorites/{item_id}",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()

    async def remove_favorite(self, item_id: int, token: str):
        session = await self._get_session()
        async with session.delete(
            f"{self.base}/favorites/{item_id}",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()

    # ── Excluded ──────────────────────────────────────────────────────────

    async def add_excluded(self, item_id: int, token: str):
        session = await self._get_session()
        async with session.post(
            f"{self.base}/excluded/{item_id}",
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()

    # ── AI ────────────────────────────────────────────────────────────────

    async def generate_idea(self, category_name: str, token: str) -> str:
        session = await self._get_session()
        async with session.post(
            f"{self.base}/ai/generate",
            json={"category_name": category_name},
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            data = await resp.json()
            return data.get("idea", "")

    # ── Items ─────────────────────────────────────────────────────────────

    async def create_item(self, name: str, category_id: int, token: str) -> dict:
        session = await self._get_session()
        async with session.post(
            f"{self.base}/items",
            json={"name": name, "category_id": category_id},
            headers=self._headers(token),
        ) as resp:
            resp.raise_for_status()
            return await resp.json()


api = ApiClient()
