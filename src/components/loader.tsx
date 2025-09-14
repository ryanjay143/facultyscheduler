import './loader.css'
import logo from '/logo.png'

const Loader = () => {
  return (
    <div className="refined-loader-container">
      <div className="refined-loader">
        <img src={logo} alt="Logo" className="refined-loader-image" />
        <div className="refined-loader-glow"></div>
      </div>
    </div>
  )
}

export default Loader