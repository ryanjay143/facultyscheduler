import './loader.css'
  import logo from '/logo.png'
  
  const Loader = () => {
    return (
      <div className="loader-overlay" aria-live="polite" role="status">
        <div className="loader" aria-hidden="true">
          <div className="loader-core">
            <img src={logo} alt="Logo" className="loader-logo" />
  
            {/* Dual animated conic-gradient rings */}
            <div className="ring ring--outer"></div>
            <div className="ring ring--inner"></div>
          </div>
  
          {/* Orbiting particles */}
          <div className="loader-orbit">
            <span className="dot dot--1" />
            <span className="dot dot--2" />
            <span className="dot dot--3" />
          </div>
  
          {/* Ambient glow */}
          <div className="soft-glow" />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  
  export default Loader