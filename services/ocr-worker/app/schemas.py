from pydantic import BaseModel, ConfigDict, Field


class BusinessCardRequest(BaseModel):
    mimeType: str = Field(..., min_length=3)
    imageBase64: str = Field(..., min_length=16)


class ContactExtraction(BaseModel):
    model_config = ConfigDict(extra="forbid")

    fullName: str = ""
    companyName: str = ""
    jobTitle: str = ""
    email: str = ""
    phone: str = ""
    linkedinUrl: str = ""
    website: str = ""


class BusinessCardResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    rawText: str = ""
    contact: ContactExtraction
