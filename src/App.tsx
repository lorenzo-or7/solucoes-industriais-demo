import { MotionConfig } from 'motion/react'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { BriefingProvider } from './hooks/useBriefing'
import { ThemeProvider } from './hooks/useTheme'
import { Capabilities } from './sections/Capabilities'
import { Contact } from './sections/Contact'
import { Differentials } from './sections/Differentials'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
import { Solutions } from './sections/Solutions'

export default function App() {
  return (
    <ThemeProvider>
      <BriefingProvider>
        <MotionConfig reducedMotion="user">
          <Navbar />
          <main id="conteudo" tabIndex={-1} className="outline-none">
            <Hero />
            <Manifesto />
            <Solutions />
            <Capabilities />
            <Projects />
            {/* "Sobre": metodologia + diferenciais */}
            <div id="sobre">
              <Process />
              <Differentials />
            </div>
            <Contact />
          </main>
          <Footer />
        </MotionConfig>
      </BriefingProvider>
    </ThemeProvider>
  )
}
