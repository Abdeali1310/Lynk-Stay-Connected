import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

const Home = lazy(()=>import("./pages/Home"))
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App