import React from "react"

import "@/styles/Description.css"

import { Divider, ExternalLink } from "./ui"

const Description: React.FC = () => {
  return (
    <article aria-label="description" className="description">
      <h2>Salasanakone luo muistettavia salasanoja</h2>
      <section>
        <h3 className="mt-05">
          Salasanageneraattori, jolla luot vahvan salasanan suomen kielen sanoista
        </h3>
        <p>
          Suomen kieli on monimutkainen, ja sen vuoksi meille otollinen tapa luoda vahva ja
          muistettava salasana tai salalause.
          <br />
          Hyvä salasana on riittävän pitkä (yli 10 kirjainta) ja sisältää numeroita, erikoismerkkejä
          sekä isoja ja pieniä kirjaimia.{" "}
          <ExternalLink link="https://security.harvard.edu/use-strong-passwords" size={19}>
            Harvard
          </ExternalLink>
          <strong> suosittelee salalauseiden käyttöä.</strong>
        </p>
        <ul>
          <li>
            Tällä salasanakoneella voit luoda automaattisesti vahvan ja muistettavissa olevan
            salalauseen, joka on lisäksi vielä helppo kirjoittaa.
          </li>
          <li>
            Tämä salasanageneraattori on vahva tapa luoda salasanoja, sillä itse keksimät salasanat
            ovat monesti liian heikkoja ja arvattavia.
          </li>
        </ul>
        <h3 className="mt-05">Mikä on salalause?</h3>
        <article title="Mikä on salalause?">
          <p>
            Salalause on yhdistelmä sanoja, ja sen tarkoituksena on olla pidempi kuin salasanat
            yleensä. Salalauseen päälimäisenä hyöty on muistettavuus.
          </p>
        </article>
        <h3 className="mt-05">Onko salalause parempi kuin salasana?</h3>
        <p>
          Yleistäen, <strong>on.</strong> Jos salalause on riittävän pitkä sekä sisältää
          välimerkkejä ja mieluusti numeroita, on sen murtaminen erittäin haastavaa.
        </p>
      </section>
      <h2 className="mt-1 mb-05">Miten salasana luodaan?</h2>
      <details className="details">
        <summary className="summary">
          Salasanakone luo satunnaisesti valituista sanoista tai merkeistä salasanan.
        </summary>
        <div className="summaryDetails">
          <p>
            Salasanakone valitsee sanat lähes 100 000:sta suomen kielen sanan joukosta
            satunnaisesti. Lisäksi kone lisää haluamasi välimerkit ja numerot sanojen väliin.
          </p>
        </div>
      </details>
      <Divider margin={"0.5rem 0"} />
      <details className="details">
        <summary className="summary">Miten vahvuus arvioidaan?</summary>
        <div className="summaryDetails">
          <p id="miten-vahvuus-arvioidaan">
            Vahvuuden arviointi tapahtuu samalla, Dropboxin avoimen lähdekoodin ohjelmalla, kuin{" "}
            <ExternalLink
              link="https://yle.fi/aihe/artikkeli/2017/02/01/digitreenit-17-salasanakone-testaa-kuinka-nopeasti-salasana-murretaan"
              size={19}
            >
              Ylen
            </ExternalLink>{" "}
            salasanan arviointikoneessa.{" "}
            <strong>Tosin, tämä kone ottaa huomioon suomalaiset sanat</strong>, jotta arviointi on
            mahdollisimman tarkka.
          </p>
          <p>
            Kone arvioi salasanan vahvuuden mm. pituuden, satunnaisuuden, ja yleisyyden perusteella.
            Lisäksi kone vertaa salasanaa suomen kielen sanakirjaan, ja sitä kautta laskee
            realistisemman vahvuuden, mikäli sanat ilmenevät muuttamattomina sanakirjassa.
          </p>
        </div>
      </details>
      <Divider margin={"0.5rem 0"} />
      <h2>Turvallinen ja luotettava</h2>
      <p>
        Sivusto ei lähetä <u>mitään</u> tietoja selaimesi ulkopuolelle, ja luo salasanat täysin
        paikallisesti - ei tietojen keräystä, mainontaa tai mitään muutakaan.
        <br />
        Sivu toimii myös ilman verkkoyhteyttä selaimen välimuistista.
        <br />
        Lisää sivusto laitteenne kotinäytölle kirjanmerkiksi, jotta saat kaiken irti
        ominaisuuksista!
      </p>
    </article>
  )
}
export { Description }
