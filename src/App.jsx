import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DemoPage from './components/DemoPage'
import DemoPageV2 from './components/DemoPageV2'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoPage />} />
        <Route path="/v2" element={<DemoPageV2 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
