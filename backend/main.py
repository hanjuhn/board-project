from fastapi import FastAPI
import sqlite3
import os

app = FastAPI()

DB_PATH = "/app/posts.db"


# --------------------
# DB 초기화
# --------------------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def get_db():
    return sqlite3.connect(DB_PATH)


init_db()


# --------------------
# API 라우트 (/api/posts)
# --------------------

@app.get("/api/posts")
def list_posts():
    conn = get_db()
    rows = conn.execute("SELECT id, text FROM posts").fetchall()
    conn.close()
    return [{"id": r[0], "text": r[1]} for r in rows]


@app.post("/api/posts")
def create_post(data: dict):
    conn = get_db()
    conn.execute("INSERT INTO posts (text) VALUES (?)", (data["text"],))
    conn.commit()
    conn.close()
    return {"result": "ok"}


@app.put("/api/posts/{post_id}")
def update_post(post_id: int, data: dict):
    conn = get_db()
    conn.execute(
        "UPDATE posts SET text = ? WHERE id = ?",
        (data["text"], post_id)
    )
    conn.commit()
    conn.close()
    return {"result": "updated"}


@app.delete("/api/posts/{post_id}")
def delete_post(post_id: int):
    conn = get_db()
    conn.execute("DELETE FROM posts WHERE id = ?", (post_id,))
    conn.commit()
    conn.close()
    return {"result": "deleted"}
