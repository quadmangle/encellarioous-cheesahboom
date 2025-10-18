import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ContactCenterPage from './pages/ContactCenterPage';
import ITSupportPage from './pages/ITSupportPage';
import ProfessionalServicesPage from './pages/ProfessionalServicesPage';
import { ThemeProvider } from './ThemeContext';
import GlobalStyle from './styles/GlobalStyle';
const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact-center" element={<ContactCenterPage />} />
            <Route path="/it-support" element={<ITSupportPage />} />
            <Route path="/professional-services" element={<ProfessionalServicesPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
