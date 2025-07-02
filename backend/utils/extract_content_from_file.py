import PyPDF2
import io

def extract_text_from_pdf_bytes(pdf_bytes):
    text = ""

    # transform bytes to pdf file
    pdf_file = io.BytesIO(pdf_bytes)

    reader = PyPDF2.PdfReader(pdf_file)

    # iterate over all pdf pages and saves the texts
    for page_num in range(len(reader.pages)):
        text += reader.pages[page_num].extract_text() or ""
    
    return text

def extract_text_from_txt_bytes(txt_bytes):
    # decode bytes to string using utf-8
    return txt_bytes.decode('utf-8')