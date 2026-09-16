from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./practicepulse.db"
    secret_key: str = "insecure-dev-key-change-me"
    access_token_expire_minutes: int = 1440
    admin_email: str = "admin@practicepulse.app"
    admin_password: str = "changeme123"
    frontend_base_url: str = "http://localhost:5173"
    anthropic_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
