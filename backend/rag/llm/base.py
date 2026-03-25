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
        """
        Generate a response from Gemini LLM in Markdown format, 
        forcing Markdown if model forgets formatting.
        """

        chat_history = [
            {"role": msg["role"], "parts": [msg["content"]]}
            for msg in history
        ]

        markdown_prompt = (
            f"{system_prompt}\n\n"
            "Formatting rules (VERY IMPORTANT):\n"
            "- Use Markdown.\n"
            "- Use bullet points (-) whenever listing items.\n"
            "- Use numbered lists for steps.\n"
            "- Avoid long paragraphs; break into bullets wherever possible.\n"
            "- Use headings (##, ###) to structure content.\n"
            "- Prefer short, structured answers over dense text.\n\n"
            f"Question:\n{question}"
        )

        chat = self.model.start_chat(history=chat_history)
        raw_response = chat.send_message(markdown_prompt).text

        # force simple Markdown fixes
        response_text = self._force_markdown(raw_response)

        return response_text

    def _force_markdown(self, text: str) -> str:
        """
        Basic post-processing to ensure headings, lists, and code blocks are Markdown-compatible.
        """
        import re

        # Fix common heading issues: ensure lines starting with numbers or titles get ##
        text = re.sub(r"^(?P<line>[A-Z][^\n]{3,})$", r"## \g<line>", text, flags=re.MULTILINE)

        # Ensure numbered lists start with 1.
        text = re.sub(r"^\s*(\d+)\.\s+", r"1. ", text, flags=re.MULTILINE)

        # Convert common bullet markers to -
        text = re.sub(r"^\s*[*•]\s+", "- ", text, flags=re.MULTILINE)

        # Ensure code blocks are wrapped properly if they look like code
        if "```" not in text and "def " in text:
            text = f"```\n{text}\n```"

        return text