import Navbar from '../components/Navbar'
import '../App.css'

function Sobre() {
  return (
    <>
    <Navbar />
    <section className="sobre-section visible">
      <div className="sobre-content">
        <h2 className="sobre-title">Sobre mim</h2>
        <div className="sobre-text">
          <p>Sou um desenvolvedor Full Stack apaixonado por criar experiências digitais que unem design e tecnologia.</p>
          <p>Com experiência em React, Node.js e UI/UX Design, transformo conceitos em produtos funcionais e visualmente impactantes.</p>
        </div>
        <div className="sobre-skills">
          <span className="skill-tag">React</span>
          <span className="skill-tag">Node.js</span>
          <span className="skill-tag">TypeScript</span>
          <span className="skill-tag">Figma</span>
          <span className="skill-tag">UI/UX</span>
        </div>
      </div>
    </section>
    </>
  )
}

export default Sobre
