# import spacy

# nlp = spacy.load("pt_core_news_lg")

# def preprocess_text(text: str):
#     if not text:
#         return ""
    
#     # proccess text using spacy
#     doc = nlp(text.lower())
    
#     lemmas = []
#     for token in doc:
#         # filter stop words, punctuation and spaces
#         if not token.is_stop and not token.is_punct and not token.is_space:
#             lemmas.append(token.lemma_)
            
#     return " ".join(lemmas)