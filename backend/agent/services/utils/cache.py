from django.conf import settings
import redis
import json
import hashlib

redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_CACHE_DB,
    decode_responses=True
)


def generate_cache_key(agent_id, question):
    normalized_q = " ".join(question.lower().strip().split())
    text = f"{agent_id}:{normalized_q}"
    return "rag_cache:" + hashlib.md5(text.encode()).hexdigest()


def get_cache(key):
    try:
        value = redis_client.get(key)
        return json.loads(value) if value else None
    except Exception as e:
        print(f"[CACHE ERROR - GET] {e}")
        return None


def set_cache(key, value, ttl=None):
    try:
        ttl = ttl or settings.CACHE_TTL
        redis_client.set(key, json.dumps(value), ex=ttl)
    except Exception as e:
        print(f"[CACHE ERROR - SET] {e}")