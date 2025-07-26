import LandingPage from './components/LandingPage'
import ClientHeader from './components/ClientHeader'
import ClientFooter from './components/ClientFooter'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <LandingPage />
      </main>
      <ClientFooter />
    </div>
  )
} 