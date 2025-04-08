import openai
import os

openai.api_key = "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"

try:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response)
except Exception as e:
    print("Error:", e)
