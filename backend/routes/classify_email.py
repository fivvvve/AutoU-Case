from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Annotated
from utils.extract_content_from_file import extract_text_from_pdf_bytes, extract_text_from_txt_bytes
from utils.nlp_processor import preprocess_text
from utils.ai_service import classify_email_async

router = APIRouter(prefix="/email", tags=["Classify Email"])

# classify and genererante email response
async def classify_email(email_content: str):
    if not email_content or not email_content.strip():
        raise HTTPException(status_code=422, detail={
            "ok": 1,
            "message": "O conteúdo do email não pode ser vazio"
        })

    processed_text = preprocess_text(email_content)
    response = await classify_email_async(processed_text)

    if "Erro" in response["classification"] or "Indefinido" in response["classification"]:
        raise HTTPException(status_code=500, detail={
            "ok": 1,
            "message": "Não foi possível classificar o email fornecido"
        })
    
    return {
        "original_content": email_content,
        "classification": response["classification"],
        "suggested_response": response["suggested_response"] if response["suggested_response"] else "Nenhuma resposta necessária."
    }


class EmailTextPayload(BaseModel):
    text: str

# email text route
@router.post("/classify-by-text")
async def classify_from_text(payload: EmailTextPayload):
    """
    Receives an email text content and classify it
    """

    return await classify_email(payload.text)



# files route
@router.post("/classify-by-file")
async def classify_from_file(email_file: Annotated[UploadFile, File()]):
    """
    Receives an email file content (.txt or .pdf) and classify it
    """
    email_content = ""
    file_bytes = await email_file.read()

    if not email_file.filename:
         raise HTTPException(status_code=400, detail={
            "ok": 1,
            "message": "Nome de arquivo inválido"
        })

    # verify if it is an pdf or txt file
    if email_file.filename.lower().endswith(".pdf"):
        try:
            email_content = extract_text_from_pdf_bytes(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail={
                "ok": 1,
                "message": "Erro ao processar PDF"
            })
    
    elif email_file.filename.lower().endswith(".txt"):
        try:
            email_content = extract_text_from_txt_bytes(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail={
                "ok": 1,
                "message": "Erro ao processar TXT"
            })
    else:
        raise HTTPException(status_code=400, detail={
            "ok": 1,
            "message": "Extensão de arquivo inválida. Os arquivos devem ser PDF ou TXT"
        })

    return await classify_email(email_content)