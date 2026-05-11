from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    BOT_TOKEN: str
    API_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()
