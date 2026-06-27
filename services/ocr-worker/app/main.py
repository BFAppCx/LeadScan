from __future__ import annotations

import base64

from fastapi import FastAPI, Header, HTTPException, status

from app.extractor import extract_business_card
from app.schemas import BusinessCardRequest, BusinessCardResponse
from app.settings import get_settings

app = FastAPI(title="LeadCard OCR Worker", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/extract/business-card", response_model=BusinessCardResponse)
def extract_business_card_endpoint(
    payload: BusinessCardRequest,
    authorization: str | None = Header(default=None),
) -> BusinessCardResponse:
    settings = get_settings()

    if settings.worker_secret:
        expected = f"Bearer {settings.worker_secret}"
        if authorization != expected:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized",
            )

    try:
        image_bytes = base64.b64decode(payload.imageBase64, validate=True)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="imageBase64 ist ungueltig.",
        ) from exc

    if len(image_bytes) > settings.max_image_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Bild ist zu gross fuer den OCR-Worker.",
        )

    try:
        return extract_business_card(payload.imageBase64)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"OCR konnte das Bild nicht verarbeiten: {exc}",
        ) from exc
