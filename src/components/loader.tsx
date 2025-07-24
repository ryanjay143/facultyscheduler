import './loader.css'
import logo from '/logo.png'

const loader = () => {
  return (
    <div className="modern-loader-container">
      <div className="modern-loader">
        <img src={logo} alt="Logo" className="modern-loader-image" />
        <div className="modern-loader-glow"></div>
      </div>
    </div>
  )
}

export default loader