# rag.llm.base.py
from abc import ABC, abstractmethod
import google.generativeai as genai
from django.conf import settings


class BaseLLMProvider(ABC):

    @abstractmethod
    def generate(self, system_prompt, user_prompt):
        pass


class GeminiProvider(BaseLLMProvider):

    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def generate(self, system_prompt, history, question):

        chat = self.model.start_chat(
            history=[
                {
                    "role": msg["role"],
                    "parts": [msg["content"]]
                }
                for msg in history
            ]
        )

        response = chat.send_message(
            f"{system_prompt}\n\n{question}"
        )

        return response.text