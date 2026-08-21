import { Routes, Route } from 'react-router-dom';

import MfPage from './pages';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MfPage />} />
      <Route path="*" element={<MfPage />} />
    </Routes>
  );
}
