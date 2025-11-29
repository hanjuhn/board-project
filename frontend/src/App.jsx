import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [posts, setPosts] = useState([])
  const [text, setText] = useState("")
  const [editingId, setEditingId] = useState(null)        // 수정 중인 게시글 ID
  const [editingText, setEditingText] = useState("")      // 수정 텍스트
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.get("/api/posts")
      setPosts(res.data)
    } catch (e) {
      console.error(e)
      setError("게시글 목록을 불러오지 못했습니다")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // 게시글 작성
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      setLoading(true)
      setError("")
      await axios.post("/api/posts", { text })
      setText("")
      await fetchPosts()
    } catch (e) {
      console.error(e)
      setError("게시글을 등록하지 못했습니다")
    } finally {
      setLoading(false)
    }
  }

  // 게시글 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요")) return
    try {
      setLoading(true)
      setError("")
      await axios.delete(`/api/posts/${id}`)
      await fetchPosts()
    } catch (e) {
      console.error(e)
      setError("게시글을 삭제하지 못했습니다")
    } finally {
      setLoading(false)
    }
  }

  // 수정 모드 진입
  const handleEdit = (id, currentText) => {
    setEditingId(id)
    setEditingText(currentText)
  }

  // 수정 요청
  const handleUpdate = async () => {
    if (!editingText.trim()) return
    try {
      setLoading(true)
      setError("")
      await axios.put(`/api/posts/${editingId}`, { text: editingText })
      setEditingId(null)
      setEditingText("")
      await fetchPosts()
    } catch (e) {
      console.error(e)
      setError("게시글을 수정하지 못했습니다")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont"
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>간단 게시판</h1>

      {/* 작성 폼 */}
      <form onSubmit={handleCreate} style={{ marginBottom: "16px" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={3}
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          글 작성
        </button>
      </form>

      {loading && <p>로딩 중입니다</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr style={{ margin: "16px 0" }} />

      <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>게시글 목록</h2>

      {posts.length === 0 && <p>등록된 게시글이 없습니다</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((p) => (
          <li
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "8px",
              marginBottom: "8px"
            }}
          >
            {editingId === p.id ? (
              <>
                {/* 수정 UI */}
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  style={{ marginTop: "8px", padding: "4px 8px" }}
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{ marginLeft: "8px", padding: "4px 8px" }}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                {/* 일반 UI */}
                <span>{p.text}</span>
                <div style={{ float: "right" }}>
                  <button
                    onClick={() => handleEdit(p.id, p.text)}
                    disabled={loading}
                    style={{
                      marginLeft: "8px",
                      padding: "4px 8px"
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={loading}
                    style={{
                      marginLeft: "8px",
                      padding: "4px 8px"
                    }}
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
