import ToastProvider from "./components/feedback/ToastProvider";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UIProvider>
           <ToastProvider />
            {children}
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
