'use client'
import "bootstrap/dist/css/bootstrap.min.css"
import './globals.css'
import ImportBootstrap from '../../components/ImportBootstrap'
import { AuthProvider } from '../../context/authContext'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

const metadata = {
  title: 'CEDEM',
  description: 'Problemas y Oportunidades de Crecimiento',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body style={{overflow: "visible"}}>
        <ImportBootstrap /> 
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
