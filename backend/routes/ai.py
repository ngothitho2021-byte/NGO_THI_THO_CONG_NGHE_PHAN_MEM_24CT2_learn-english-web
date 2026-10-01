import json
import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

load_dotenv()

router = APIRouter(prefix="/api/ai", tags=["AI"])

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


class SpeakingCheckRequest(BaseModel):
    user_text: str = Field(min_length=1, max_length=2000)
    question: str = Field(min_length=1, max_length=2000)


class WritingCheckRequest(BaseModel):
    text: str = Field(min_length=1, max_length=12000)
    topic_title: str = Field(min_length=1, max_length=500)
    topic_prompt: str = Field(min_length=1, max_length=2000)


def _get_api_key() -> str:
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Backend chưa được cấu hình GROQ_API_KEY. Hãy tạo backend/.env từ .env.example.",
        )
    return api_key


def _parse_json_content(raw: str) -> dict[str, Any]:
    cleaned = raw.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    try:
        value = json.loads(cleaned.strip())
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail="AI trả về dữ liệu không đúng định dạng JSON.") from exc
    if not isinstance(value, dict):
        raise HTTPException(status_code=502, detail="AI trả về dữ liệu không hợp lệ.")
    return value


async def _call_groq(system_prompt: str, user_prompt: str, temperature: float = 0.2) -> dict[str, Any]:
    api_key = _get_api_key()
    payload = {
        "model": GROQ_MODEL,
        "temperature": temperature,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "response_format": {"type": "json_object"},
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail="Không kết nối được tới dịch vụ AI.") from exc

    if response.status_code >= 400:
        # Không trả nội dung lỗi gốc ra frontend để tránh lộ thông tin không cần thiết.
        raise HTTPException(status_code=502, detail=f"Dịch vụ AI trả lỗi HTTP {response.status_code}.")

    try:
        data = response.json()
        raw = data["choices"][0]["message"]["content"]
    except (ValueError, KeyError, IndexError, TypeError) as exc:
        raise HTTPException(status_code=502, detail="AI không trả về nội dung hợp lệ.") from exc

    return _parse_json_content(str(raw))


@router.post("/speaking/check")
async def check_speaking(payload: SpeakingCheckRequest):
    system_prompt = """You are an expert English teacher evaluating a student's spoken/written answer in a dialogue.

Evaluate in TWO SEPARATE STEPS:
1. isRelevant: Does the student's answer make sense as a reply to the question?
2. isGrammarCorrect: Is the sentence grammatically correct and natural English? Ignore minor capitalization and ending punctuation.

The student does not need to match a fixed sample sentence. Judge meaning and grammar.
correctedSentence: provide a natural corrected version.
explanation: explain briefly in Vietnamese (1-2 sentences).

Respond ONLY with a raw JSON object in exactly this shape:
{
  "isRelevant": boolean,
  "isGrammarCorrect": boolean,
  "correctedSentence": "string",
  "explanation": "string"
}"""
    user_prompt = f'Partner asked: "{payload.question}"\nStudent answered: "{payload.user_text}"'
    result = await _call_groq(system_prompt, user_prompt, temperature=0.2)

    return {
        "isRelevant": bool(result.get("isRelevant")),
        "isGrammarCorrect": bool(result.get("isGrammarCorrect")),
        "correctedSentence": str(result.get("correctedSentence") or payload.user_text),
        "explanation": str(result.get("explanation") or ""),
    }


@router.post("/writing/check")
async def check_writing(payload: WritingCheckRequest):
    system_prompt = """Bạn là giáo viên tiếng Anh chấm bài viết cho người Việt đang học tiếng Anh.
Kiểm tra: (1) bài có bám sát chủ đề không; (2) lỗi ngữ pháp, dùng từ, chính tả; sửa lỗi và giải thích ngắn gọn.

CHỈ trả lời bằng một object JSON hợp lệ, không markdown, đúng cấu trúc:
{
  "onTopic": true,
  "topicFeedback": "nhận xét ngắn bằng tiếng Việt",
  "score": 0,
  "issues": [
    {
      "original": "cụm/câu gốc",
      "errorType": "loại lỗi",
      "correction": "phiên bản sửa",
      "explanation": "giải thích bằng tiếng Việt"
    }
  ],
  "corrected": "toàn bộ bài sau khi sửa",
  "overallFeedback": "nhận xét tổng quan bằng tiếng Việt"
}

score phải là số nguyên từ 0 đến 100. Nếu không có lỗi, issues là []."""
    user_prompt = (
        f'Chủ đề được giao: "{payload.topic_title}"\n'
        f'Yêu cầu đề bài: "{payload.topic_prompt}"\n\n'
        f'Bài viết của học viên:\n"""\n{payload.text}\n"""'
    )
    result = await _call_groq(system_prompt, user_prompt, temperature=0.3)

    score = result.get("score")
    try:
        score = max(0, min(100, int(score))) if score is not None else None
    except (TypeError, ValueError):
        score = None

    return {
        "onTopic": bool(result.get("onTopic")),
        "topicFeedback": str(result.get("topicFeedback") or ""),
        "score": score,
        "issues": result.get("issues") if isinstance(result.get("issues"), list) else [],
        "corrected": str(result.get("corrected") or ""),
        "overallFeedback": str(result.get("overallFeedback") or ""),
    }
