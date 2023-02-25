import React from "react"
import "../styles/Home.css"
const Description: React.FC = () => {
  return (
    <>
      <div aria-label="description" className="description">
        <h2>
          Luo muistettavia salasanoja!
        </h2>
        <p>
        Tällä sivulla voit luoda Salasanan Suomen kielen sanoista. Tunnetusti suomi on hankala kieli, ja se osaltaan tekee salasanoista vahvempia murtaa. Toisaalta, tämän tuottamat salasanat ovat helpompia muistaa!
        </p>
        <p>
          Tsekkaa sivustoni:
        </p>
          <div className="imageWrapper">
          <img className="svgImage" src="favicon.png" alt="Logo" width={20} height={20} 
          />
          <a title="Opens in a new tab" href="https://deweloper.fi" target="_blank" rel="noreferrer">
            deweloper.fi</a> 
          </div>
      </div>
    </>
  )
}
export default Description