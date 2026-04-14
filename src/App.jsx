import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DemoPage from './components/DemoPage'
import DemoPageV2 from './components/DemoPageV2'
import DemoPageV3 from './components/DemoPageV3'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<DemoPage />} />
        <Route path="/v2" element={<DemoPageV2 />} />
        <Route path="/v3" element={<DemoPageV3 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
