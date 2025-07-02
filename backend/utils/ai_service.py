import google.generativeai as genai
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

# uses gemini 1.5 flash as model
model = genai.GenerativeModel(model_name="gemini-2.0-flash")

async def classify_email_async(email_text: str):
    prompt = f"""
    Classifique o seguinte e-mail em uma das categorias: 'Produtivo' ou 'Improdutivo'.
    - 'Improdutivo':
    Motivos para email ser improdutivo:
    1. Não requer uma resposta, como por exemplo avisos gerais de manutenção, mundanças de datas ou divulgações.
    2. Não requer uma ação específica, como agradecimentos ou felicitações. 
    3. Avisos que não requerem uma ação intelectual de uma pessoa, sendo somente um aviso que pode visualizado posteriormente.
    4. Possui algo como 'não responda', 'email gerado automaticamente', 'favor não responder', 'no reply' ou similares no texto.
    - 'Produtivo': Requer uma ação ou resposta (solicitações, dúvidas, atualizações).

    Após realizar a classificação sugira uma resposta para o email:
    Um email produtivo deve ter uma resposta inicial concisa e profissional, indicando que a solicitação foi recebida e será tratada.

    Um email improdutivo geralmente não terá respostas, exceto quando for agradecimentos ou felicitações.
    
    Resposta deve estar da seguinte forma:
    <Classificação>
    <Resposta em texto simples em uma mesma linha>
    Caso não haja nenhuma resposta somente deixe um espaço vazio.

    Se o email possuir algo como 'não responda', 'email gerado automaticamente', 'favor não responder', 'no reply' ou similares no texto, retorne que email não deve ser respondido.

    A mensagem do email foi direcionada a você, responda como se fosse o destinatário.

    E-mail:
    "{email_text}"

    Classificação:"""

    try:
        # uses async.to_thread to do not stop server
        response = await asyncio.to_thread(model.generate_content, prompt)
        response = response.text.strip().split('\n')

        classification = response[0]

        suggested_response = "\n".join(response[1:])
        
        return {
            "classification": classification,
            "suggested_response": suggested_response
        }
    except Exception as e:
        print(f"Erro ao classificar e-mail: {e}")
        return {
            "classification": "Erro na Classificação",
            "suggested_response": ""
        }