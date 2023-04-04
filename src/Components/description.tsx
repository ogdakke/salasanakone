import React from "react";

import "../styles/Description.css";

import { Divider } from "./ui/divider";
import { ExternalLink } from "./ui/externalLink"

const Description: React.FC = () => {
    return (
        <>
            <div aria-label="description" className="description">
                <h2>Salasanakone luo muistettavia salasanoja.</h2>
                <details className="details">
                    <summary className="summary">
                        Salasanakone - Luo vahva salasana käyttämällä suomen
                        kielen sanoja.
                    </summary>
                    <div className="summaryDetails">
                        <p>
                            Suomen kieli on monimutkainen, ja sen vuoksi meille
                            otollinen tapa luoda vahva ja muistettava salasana.
                            <br />
                            Hyvä salasana on riittävän pitkä (yli 14 kirjainta) ja sisältää
                            numeroita, erikoismerkkejä sekä isoja ja pieniä kirjaimia. 
                        </p>
                            <ul>
                              <li>
                              Tällä salasanakoneella voit luoda automaattisesti vahvan ja muistettavissa olevan salasanan, joka on lisäksi vielä helppo kirjoittaa. 
                              </li>
                              <li>
                              Tämä salasanageneraattori on vahva tapa luoda salasanoja, sillä itse keksimät salasanat ovat monesti liian heikkoja ja arvattavia.
                              </li> 
                            </ul> 
                    </div>
                </details>
                <h2>Miten salasana luodaan?</h2>
                <details className="details">
                    <summary className="summary">
                        Salasanakone luo satunnaisesti valituista sanoista tai
                        merkeistä salasanan.
                    </summary>
                    <div className="summaryDetails">
                        <p>
                            Salasanakone valitsee sanat lähes 100 000:sta suomen
                            kielen sanan joukosta satunnaisesti. Lisäksi kone lisää haluamasi välimerkit ja numerot sanojen väliin.
                        </p>
                    </div>
                </details>
                    <Divider margin={"0.5rem 0"} />
                <details className="details">
                    <summary className="summary">
                        Miten vahvuus arvioidaan?
                    </summary>
                    <div className="summaryDetails">
                        <p id="miten-vahvuus-arvioidaan">
                            Vahvuuden arviointi tapahtuu samalla, Dropboxin avoimen lähdekoodin ohjelmalla, kuin <ExternalLink link="https://yle.fi/aihe/artikkeli/2017/02/01/digitreenit-17-salasanakone-testaa-kuinka-nopeasti-salasana-murretaan" size={20}>Ylen</ExternalLink> salasanan arviointikoneessa. <strong>Tosin, tämä kone ottaa huomioon suomalaiset sanat</strong>, jotta arviointi on mahdollisimman tarkka. 
                        </p>
                        <p>
                          Kone arvioi salasanan vahvuuden mm. pituuden, satunnaisuuden, ja yleisyyden perusteella. Lisäksi kone vertaa salasanaa suomen kielen sanakirjaan, ja sitä kautta laskee realistisemman vahvuuden, mikäli sanat ilmenevät muuttamattomina sanakirjassa.
                        </p>
                    </div>
                </details>
                <Divider margin={"0.5rem 0"} />
                <h2>Turvallinen ja luotettava</h2>
                <p>
                    Sivusto ei lähetä <u>mitään</u> tietoja selaimesi
                    ulkopuolelle, ja luo salasanat täysin paikallisesti - ei
                    tietojen keräystä, mainontaa tai mitään muutakaan.
                    <br />
                    Sivu toimii myös ilman verkkoyhteyttä selaimen
                    välimuistista.
                    <br />
                    Lisää sivusto laitteenne kotinäytölle kirjanmerkiksi, jotta
                    saat kaiken irti ominaisuuksista!
                </p>                
            </div>
        </>
    );
};
export default Description;
