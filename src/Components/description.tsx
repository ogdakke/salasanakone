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
        <br /> 
        Sivusto ei lähetä <u>mitään</u> tietoja selaimesi ulkopuolelle, ja luo salasanat täysin paikallisesti - ei tietojen keräystä, mainontaa tai mitään muutakaan.
        </p>
        <p>
          <br />
        </p>
          <div className="imageWrapper">
          <img loading="lazy" className="svgImage" src="/favicon.svg" alt="Logo" width={20} height={20} 
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