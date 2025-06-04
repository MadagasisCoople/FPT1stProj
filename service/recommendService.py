import openai
import json


class recommendService:

    openai.api_key = "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"

    async def aiSuggestMusic(self, query: str):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system","content": f"You are a music suggestion of Youtube. Using youber, suggesting for me a song name make sure the ouput is a string following this format: Yours {query} is matched with + (the song you recommend)"},
                {"role": "user", "content": query}
            ]
        )

        contentRaw = response.choices[0].message.content

        return contentRaw

    async def aiPickMusic(self, username: str, query: str, db):
        collection = db["users"]
        
        userNames = await collection.find_one({"userName":username})

        musicNameList = [songName["userMusic"] for songName in userNames["userMusic"] if "userMusic" in songName]

        songNameList = "\n".join(f"-{name}" for name in musicNameList)

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a music producer. Based on the user's music list produced by them, suggest a song from the list that matches with their query and answer in format with plain text: Yours {query} is matched with (suggested song)"},
                {"role": "user", "content": f"The user's songs:\n{songNameList}\nNow suggest one that fits {query}"}
        ]
    )
        return response.choices[0].message.content