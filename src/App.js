import { useState } from "react"
import SearchBar from "./components/SearchBar"

function App() {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchData = async (username) => {
    setLoading(true)
    setError("")

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`)
      if (!userRes.ok) throw new Error("User not found")
      const userData = await userRes.json()

      const repoRes = await fetch(`https://api.github.com/users/${username}/repos`)
      const repoData = await repoRes.json()

      const topRepos = repoData
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)

      setUser(userData)
      setRepos(topRepos)

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div>
      <h1>GitHub Dashboard</h1>
      <SearchBar onSearch={fetchData} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {user && (
        <div>
          <img src={user.avatar_url} width="100" alt="avatar" />
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      )}

      {repos.map((repo) => (
        <div key={repo.id}>
          <h3>{repo.name}</h3>
          <p>⭐ {repo.stargazers_count}</p>
        </div>
      ))}
    </div>
  )
}

export default App;
