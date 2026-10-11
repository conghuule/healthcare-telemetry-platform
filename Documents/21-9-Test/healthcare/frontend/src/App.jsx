import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PatientDetailPage } from './features/patients/PatientDetailPage.jsx';
import { PatientListPage } from './features/patients/PatientListPage.jsx';

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<PatientListPage />} />
    <Route path="/patients/:patientId" element={<PatientDetailPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
