import json
from vkbottle.bot import Message
from vkbottle.dispatch.rules import ABCRule


class PayloadCmd(ABCRule[Message]):
    """Matches messages where payload["cmd"] == cmd (ignores other payload keys)."""

    def __init__(self, cmd: str):
        self.cmd = cmd

    async def check(self, event: Message) -> bool:
        p = event.payload
        if isinstance(p, str):
            try:
                p = json.loads(p)
            except Exception:
                return False
        return isinstance(p, dict) and p.get("cmd") == self.cmd
