import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/auth.context'
import { ReportProvider } from './features/resume-analysis/report.context.jsx';
import { TooltipProvider } from '@/components/ui/tooltip.jsx';
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <TooltipProvider>
      <AuthProvider>
        <ReportProvider>
          <App />
          <Toaster richColors />
        </ReportProvider>
      </AuthProvider>
    </TooltipProvider>
  </BrowserRouter>
  
 
  
)
