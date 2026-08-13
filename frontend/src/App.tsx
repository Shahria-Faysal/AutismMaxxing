// src/App.tsx — Root router configuration
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IntroScreen from './components/IntroScreen'
import ScreeningScreen from './components/ScreeningScreen'
import ResultsScreen from './components/ResultsScreen'
import SpecialAssessmentPage from './components/SpecialAssessmentPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<IntroScreen />} />
        <Route path="/screening"          element={<ScreeningScreen />} />
        <Route path="/results"            element={<ResultsScreen />} />
        <Route path="/special-assessment" element={<SpecialAssessmentPage />} />
      </Routes>
    </BrowserRouter>
  )
}
