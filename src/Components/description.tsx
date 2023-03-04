import React from "react"
import "../styles/Description.css"
const Description: React.FC = () => {
  return (
    <>
      <div aria-label="description" className="description">
        <h2>
          Luo muistettavia salasanoja!
        </h2>
        <p>
        Tällä sivulla voit luoda vahvan salasanan käyttämällä suomen kielen sanoja. Suomen kieli on monimutkainen, ja sen vuoksi otollinen tapa luoda vahva ja muistettava salasana.
        </p>
        <p>
          Tehnyt:
        </p>
          <div className="imageWrapper">
          <img className="svgImage" src="favicon.png" alt="Logo" width={20} height={20} 
          />
            <a title="Opens in a new tab" href="https://deweloper.fi" target="_blank" rel="noreferrer">
            deweloper.fi
            </a> 
          </div>
      </div>
    </>
  )
}
export default Description