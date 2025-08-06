import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Import all pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import ApiReference from './pages/ApiReference';
import UseCases from './pages/UseCases';
import SDKs from './pages/SDKs';
import Blog from './pages/Blog';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Careers from './pages/Careers';
import Integrations from './pages/Integrations';
import Roadmap from './pages/Roadmap';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/api" element={<ApiReference />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/sdks" element={<SDKs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
