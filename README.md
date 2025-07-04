# AutoU Case

Este é um projeto para classificação e geração de respostas para email feito como parte do processo seletivo da AutoU.
O objetivo da aplicação é receber como entrada um texto de um email ou um arquivo .pdf ou .txt contendo o email e a partir dele classificá-lo em uma de duas categorias:

• Produtivo: Emails que requerem uma ação ou resposta específica (ex.: solicitações de suporte técnico, atualização sobre casos em aberto, dúvidas sobre o sistema).

• Improdutivo: Emails que não necessitam de uma ação imediata (ex.: mensagens de felicitações, agradecimentos).

Após realizar a classificação, uma resposta para o email também é gerada e sugerida para o usuário, que pode ser utilizada para responder o email real.

Caso deseje visualizar e testar o projeto, ele pode ser acessado em https://auto-u-frontent.vercel.app/ .

**Obs.: Ao acessar o site e enviar um email, a resposta pode demorar a aparecer porque o backend está hospedado no Render, que encerra o servidor após um período de inatividade. Nesse caso, ao enviar a requisição, o servidor precisa ser reativado, o que pode levar alguns segundos. Após essa inicialização, a aplicação funcionará normalmente.**

## Principais tecnologias utilizadas

• Frontend: React com Vite, Tailwind, Axios, React-icons e React-hot-toast.

• Backend: FastAPI, Google Generative AI com Gemini 2.5 flash, PyPDF2 e Spacy.

Obs. 1: Para o deploy do backend, a biblioteca Spacy não está sendo aplicada para realizar um pré-processamento do texto (lemmatização), visto que a biblioteca aplicada junto com o módulo *pt_core_news_lg* (para identificação de stop words e pontuações em português) ultrapassa os limites do free tier das plataformas de deploy.

Obs. 2: Existe um limite de uso da API do Gemini que está sendo aplicada, assim sendo possível realizar a classificação de no máximo 10 emails em 1 minuto e 250 em 1 dia.

## Instalação local

Primeiramente clone o repositório ou baixe os arquivos.

### Frontend

1. Navega até a pasta do frontend em seu computador.

2. Instale as dependências com o comando:

   ```bash
   npm install
   ```

3. Crie um arquivo chamado .env na raiz e coloque o seguinte conteúdo no arquivo:

    ```bash
    VITE_BACKEND_URL="http://127.0.0.1:8000/"
    ```
A URL do backend pode variar de computador para computador, porém usualmente esta será a URL. Caso deseje alterá-la, lembre-se de deixar uma **/** no final da URL.

4. Inicie o servidor:

   ```bash
   npm run dev
   ```
   
### Backend

1. Navega até a pasta do backend em seu computador.

2. Crie um ambiente virtual e o acesse com:

   ```bash
   //Ubuntu
   python3 -m venv .venv
   source .venv/bin/activate

   //Windows
   python -m venv .venv
   .venv\Scripts\activate
   ```

4. Instale as dependências com o comando:

   ```bash
   pip install -r requirements.txt
   ```

5. Crie um arquivo chamado .env na raiz e coloque o seguinte conteúdo no arquivo:

    ```bash
    GOOGLE_API_KEY="SUAKEY"
    ALLOWED_ORIGINS="http://localhost:5173"
    ```

Lembre-se de adicionar sua key da api do Google em GOOGLE_API_KEY, ela pode ser obtida acessando https://aistudio.google.com/u/2/apikey .

A URL de ALLOWED_ORIGINS pode variar de computador para computador, porém usualmente esta será a URL. Caso deseje é possível definir mais de uma URL, para isso utiliza uma **,** (vírgula).

Ex.: ALLOWED_ORIGINS="http://localhost:5173,http://seudominio.app"

4. Inicie o servidor:

   ```bash
   uvicorn app:app
   ```


Após realizar todos os passos descritos, acesse a URL do servidor do frontend em seu navegador e a aplicação estará pronta para uso.
