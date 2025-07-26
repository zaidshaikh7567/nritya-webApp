import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'Nritya - Discover the beat in your city!',
  description: 'India\'s first dance tech platform connecting dance enthusiasts with top dance studios in the city.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 