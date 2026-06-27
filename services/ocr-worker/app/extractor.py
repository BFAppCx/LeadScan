from __future__ import annotations

import base64
import re
from functools import lru_cache
from io import BytesIO

import numpy as np
from PIL import Image, ImageOps

from app.schemas import BusinessCardResponse, ContactExtraction
from app.settings import get_settings

TITLE_HINTS = {
    "manager",
    "director",
    "sales",
    "marketing",
    "partnerships",
    "business",
    "development",
    "ceo",
    "coo",
    "cto",
    "founder",
    "owner",
    "head",
    "lead",
    "consultant",
}

COMPANY_HINTS = {
    "gmbh",
    "ug",
    "ag",
    "kg",
    "llc",
    "ltd",
    "inc",
    "company",
    "solutions",
    "systems",
    "group",
    "technologies",
    "tech",
}

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+", re.IGNORECASE)
URL_RE = re.compile(r"(https?://[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(?:de|com|io|ai|net|org|co)(?:/[^\s]*)?)", re.IGNORECASE)
PHONE_RE = re.compile(r"(?:(?:\+|00)\d{1,3}[\s./-]?)?(?:\(?\d{2,5}\)?[\s./-]?){2,}\d{2,}")
LINKEDIN_RE = re.compile(r"(https?://)?(www\.)?linkedin\.com/[^\s]+", re.IGNORECASE)


def decode_image(image_base64: str) -> bytes:
    return base64.b64decode(image_base64, validate=True)


def prepare_image(image_bytes: bytes) -> np.ndarray:
    with Image.open(BytesIO(image_bytes)) as image:
        normalized = ImageOps.exif_transpose(image).convert("RGB")
        return np.array(normalized)


class PaddleOcrClient:
    def __init__(self) -> None:
        settings = get_settings()

        try:
            from paddleocr import PaddleOCR
        except ImportError as exc:
            raise RuntimeError(
                "PaddleOCR ist nicht installiert. Bitte requirements.txt im OCR-Worker installieren."
            ) from exc

        self.client = PaddleOCR(use_angle_cls=True, lang=settings.paddle_lang, show_log=False)

    def extract_text(self, image_bytes: bytes) -> str:
        image_array = prepare_image(image_bytes)
        result = self.client.ocr(image_array, cls=True)
        lines: list[str] = []

        for block in result or []:
            for item in block or []:
                if len(item) > 1 and isinstance(item[1], (list, tuple)) and item[1]:
                    text = str(item[1][0]).strip()
                    if text:
                        lines.append(text)

        return "\n".join(lines)


@lru_cache(maxsize=1)
def get_ocr_client() -> PaddleOcrClient:
    return PaddleOcrClient()


def normalize_lines(raw_text: str) -> list[str]:
    seen: set[str] = set()
    lines: list[str] = []

    for line in raw_text.splitlines():
        cleaned = " ".join(line.strip().split())
        if cleaned and cleaned.lower() not in seen:
            seen.add(cleaned.lower())
            lines.append(cleaned)

    return lines


def looks_like_person_name(line: str) -> bool:
    parts = [part for part in re.split(r"\s+", line) if part]
    if len(parts) < 2 or len(parts) > 4:
        return False
    if any(any(char.isdigit() for char in part) for part in parts):
        return False
    return all(part[:1].isupper() for part in parts if part[:1].isalpha())


def find_name(lines: list[str]) -> str:
    for line in lines[:4]:
        if looks_like_person_name(line):
            return line
    return ""


def find_company(lines: list[str], name: str, title: str) -> str:
    for line in lines[:8]:
        lowered = line.lower()
        if line == name or line == title:
            continue
        if any(hint in lowered for hint in COMPANY_HINTS):
            return line

    for line in lines[:8]:
        if line not in {name, title} and not EMAIL_RE.search(line) and not URL_RE.search(line):
            return line

    return ""


def find_job_title(lines: list[str], name: str) -> str:
    for line in lines[:8]:
        lowered = line.lower()
        if line == name:
            continue
        if any(hint in lowered for hint in TITLE_HINTS):
            return line
    return ""


def first_match(pattern: re.Pattern[str], raw_text: str) -> str:
    match = pattern.search(raw_text)
    return match.group(0).strip() if match else ""


def sanitize_website(url: str) -> str:
    if not url:
        return ""
    if LINKEDIN_RE.search(url):
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    return f"https://{url}"


def sanitize_linkedin(url: str) -> str:
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    return f"https://{url}"


def build_structured_response(raw_text: str) -> BusinessCardResponse:
    lines = normalize_lines(raw_text)
    name = find_name(lines)
    title = find_job_title(lines, name)
    company = find_company(lines, name, title)
    email = first_match(EMAIL_RE, raw_text)
    linkedin = sanitize_linkedin(first_match(LINKEDIN_RE, raw_text))
    website = sanitize_website(first_match(URL_RE, raw_text))
    phone = first_match(PHONE_RE, raw_text)

    if website == linkedin:
        website = ""

    return BusinessCardResponse(
        rawText=raw_text,
        contact=ContactExtraction(
            fullName=name,
            companyName=company,
            jobTitle=title,
            email=email,
            phone=phone,
            linkedinUrl=linkedin,
            website=website,
        ),
    )


def extract_business_card(image_base64: str) -> BusinessCardResponse:
    image_bytes = decode_image(image_base64)
    raw_text = get_ocr_client().extract_text(image_bytes)
    return build_structured_response(raw_text)
