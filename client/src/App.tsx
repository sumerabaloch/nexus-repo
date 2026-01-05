import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// Dashboard Pages
import { EntrepreneurDashboard } from "./pages/dashboard/EntrepreneurDashboard";
import { InvestorDashboard } from "./pages/dashboard/InvestorDashboard";

// Profile Pages
import { EntrepreneurProfile } from "./pages/profile/EntrepreneurProfile";
import { InvestorProfile } from "./pages/profile/InvestorProfile";

// Feature Pages
import { InvestorsPage } from "./pages/investors/InvestorsPage";
import { EntrepreneursPage } from "./pages/entrepreneurs/EntrepreneursPage";
import { MessagesPage } from "./pages/messages/MessagesPage";
import { NotificationsPage } from "./pages/notifications/NotificationsPage";
import { DocumentsPage } from "./pages/documents/DocumentsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { HelpPage } from "./pages/help/HelpPage";
import { DealsPage } from "./pages/deals/DealsPage";

// Chat
import { ChatPage } from "./pages/chat/ChatPage";

// Video & Payments (FIXED)
import VideoCall from "./components/video/VideoCall";
import PaymentPages from "./pages/payments/PaymentPages";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Video */}
          <Route path="/video" element={<DashboardLayout />}>
            <Route index element={<VideoCall roomId="global-room" />} />
          </Route>

          {/* Payments */}
          <Route path="/payments" element={<DashboardLayout />}>
            <Route index element={<PaymentPages />} />
          </Route>

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
            <Route path="investor" element={<InvestorDashboard />} />
          </Route>

          {/* Profiles */}
          <Route path="/profile" element={<DashboardLayout />}>
            <Route path="entrepreneur/:id" element={<EntrepreneurProfile />} />
            <Route path="investor/:id" element={<InvestorProfile />} />
          </Route>

          {/* Features */}
          <Route path="/investors" element={<DashboardLayout />}>
            <Route index element={<InvestorsPage />} />
          </Route>

          <Route path="/entrepreneurs" element={<DashboardLayout />}>
            <Route index element={<EntrepreneursPage />} />
          </Route>

          <Route path="/messages" element={<DashboardLayout />}>
            <Route index element={<MessagesPage />} />
          </Route>

          <Route path="/notifications" element={<DashboardLayout />}>
            <Route index element={<NotificationsPage />} />
          </Route>

          <Route path="/documents" element={<DashboardLayout />}>
            <Route index element={<DocumentsPage />} />
          </Route>

          <Route path="/settings" element={<DashboardLayout />}>
            <Route index element={<SettingsPage />} />
          </Route>

          <Route path="/help" element={<DashboardLayout />}>
            <Route index element={<HelpPage />} />
          </Route>

          <Route path="/deals" element={<DashboardLayout />}>
            <Route index element={<DealsPage />} />
          </Route>

          {/* Chat */}
          <Route path="/chat" element={<DashboardLayout />}>
            <Route index element={<ChatPage />} />
            <Route path=":userId" element={<ChatPage />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;