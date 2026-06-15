import { AuthProvider } from "@/lib/authContext";
import QueryProvider from "@/lib/queryProvider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from 'sonner';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen flex flex-col bg-background">
        <QueryProvider> 
          <AuthProvider>
            <Header /> 
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
