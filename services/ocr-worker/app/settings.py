from functools import lru_cache
from os import getenv


class Settings:
    def __init__(self) -> None:
        self.worker_secret = getenv("OCR_WORKER_SECRET", "").strip()
        self.engine = getenv("OCR_ENGINE", "paddleocr").strip().lower()
        self.paddle_lang = getenv("OCR_PADDLE_LANG", "en").strip().lower()
        self.max_image_bytes = int(getenv("OCR_MAX_IMAGE_BYTES", "10485760"))


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
