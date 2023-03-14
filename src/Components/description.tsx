import React from "react"
import "../styles/Description.css"

const Description: React.FC = () => {
  return (
    <>
      <div aria-label="description" className="description">
        <h1>
          Luo muistettavia salasanoja!
        </h1>
        
        <p>
          Tällä sivulla voit luoda vahvan salasanan käyttämällä suomen kielen sanoja. Suomen kieli on monimutkainen, ja sen vuoksi meille otollinen tapa luoda vahva ja muistettava salasana.
        </p>
        <br />
        
        <h2>Miten toimii?</h2>
        
        <p>
          Sivusto luo satunnaisesti valituista sanoista tai merkeistä salasanan.
          Sivusto ei lähetä <u>mitään</u> tietoja selaimesi ulkopuolelle, ja luo salasanat täysin paikallisesti - ei tietojen keräystä, mainontaa tai mitään muutakaan. 
          <br />
          Sivu toimii myös ilman verkkoyhteyttä "tallentamalla" itsensä selaimeen.
          <br />
          Lisää sivusto laitteenne kotinäytölle kirjanmerkiksi, jotta saat kaiken irti ominaisuuksista!
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