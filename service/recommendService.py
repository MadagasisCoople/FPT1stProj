import openai
import json

class recommendService:
    
    openai.api_key = "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"

    async def aiSuggestMusic(self, query: str):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages =[
                {"role": "system", "content": f"You are a music suggestion of Youtube. Using youber, suggesting for me a song name make sure the ouput is a string following this format: Yours {query} is matched with + (the song you recommend)"},
                {"role": "user" , "content" : query}
            ]
        ) 

        contentRaw = response.choices[0].message.content

        return contentRaw
