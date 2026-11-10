import OfferButton from "../../components/OfferButton";
import InitialScrollToPolyphenols from "../../components/InitialScrollToPolyphenols";
import ScratchCouponPopup from "../../components/ScratchCouponPopup";

const PRODUCT_IMAGE = "/images/vge-dupla-csomag.webp";
const DETAIL_IMAGE = "https://raw.githubusercontent.com/lenkei/vitalgrape-web/main/public/images/products/vge/gallery-1.webp";
const LIFESTYLE_IMAGE = "https://raw.githubusercontent.com/lenkei/vitalgrape-web/main/public/images/products/vge/gallery-2.webp";

const ingredients = [
  { count: "01", name: "Szőlő", latin: "Vitis vinifera", description: "A szőlő jellegzetes növényi összetevői között különböző polifenolok is előfordulnak." },
  { count: "02", name: "Csipkebogyó", latin: "Rosa canina", description: "A csipkebogyó sajátos növényi eredetű vegyületeket tartalmazó alapanyag." },
  { count: "03", name: "Fekete szeder", latin: "Rubus fruticosus", description: "Mély színéhez természetes pigmentek, köztük antociánok járulnak hozzá." }
];

const questions = [
  ["Mi a Vital Grape Essence?", "Szőlőre, csipkebogyóra és fekete szederre épülő prémium, folyékony étrend-kiegészítő. Nem gyógyszer."],
  ["Mi az a polifenol?", "Növényi vegyületek széles csoportjának gyűjtőneve. Jelenlétük önmagában nem igazol egészségügyi hatást."],
  ["Mennyi az ajánlott napi adag?", "A címke szerinti napi ajánlott mennyiség 4 cl. Két 500 ml-es palack összesen 25 napi adagot tartalmaz."],
  ["Van benne alkohol és cukor?", "Igen. A termék 11% (V/V) alkoholt, cukrot és szulfitokat tartalmaz. Fogyasztás előtt mindig olvassa el a címkét."],
  ["Minden szállítási mód ingyenes?", "A kiemelt dupla csomaghoz a GLS-szállítás díjmentes. A Magyar Posta külön díjas lehet; a végső díjakat a pénztár mutatja."],
  ["Szedhető gyógyszer mellett?", "Gyógyszeres kezelés vagy fennálló betegség esetén az alkoholtartalom miatt egyeztessen kezelőorvosával."]
];

function SectionNumber({ n }) {
  return <span className="section-number">{n}</span>;
}

function GoldLine() {
  return <span className="gold-line" aria-hidden="true" />;
}

export default function OfferPage() {
  return (
    <>
      <InitialScrollToPolyphenols />
      <ScratchCouponPopup />
      <div className="announcement">VITAL GRAPE ESSENCE <span>◆</span> A TERMÉSZET ESSZENCIÁJA</div>
      <header className="main-nav">
        <a className="wordmark" href="#top" aria-label="Vital Grape Essence kezdőlap"><span>V·G·E</span><small>VITAL GRAPE ESSENCE</small></a>
        <nav aria-label="Oldal menü"><a href="#osszetevok">Összetevők</a><a href="#tudomany">Polifenolok</a><a href="#kerdesek">GYIK</a></nav>
        <a className="nav-offer" href="#dupla">AJÁNLAT</a>
      </header>

      <main id="top">
        <section className="feature" id="dupla" aria-labelledby="feature-title">
          <div className="feature-copy">
            <p className="eyebrow gold">KIEMELT AJÁNLAT <span className="eyebrow-line" /></p>
            <h1 id="feature-title">A dupla csomag.<br/><em>Jobban megéri.</em></h1>
            <p className="feature-lead">Két palack egyetlen különleges választásban. Kedvezőbb csomagár, díjmentes GLS-szállítás és elegendő mennyiség egy 25 napos kezdéshez.</p>
            <div className="feature-pills">
              <span>2 × 500 ml</span><span>25 napi adag</span><span>GLS: 0 Ft</span>
            </div>
            <div className="offer-price"><strong>49 000 Ft</strong><span>24 500 Ft / üveg</span></div>
            <OfferButton className="button gold-button" />
            <p className="micro gold-dim">A legtöbbször választott csomag – a vásárlási adatok ellenőrzése szükséges az éles megjelenés előtt.</p>
          </div>
          <div className="feature-visual">
            <div className="visual-frame">
              <span className="visual-topline">VITAL GRAPE ESSENCE · ROSA CANINA</span>
              <img src={PRODUCT_IMAGE} alt="Vital Grape Essence dupla csomag: két eredeti palack és fekete díszdoboz" />
              <div className="visual-bottom"><span>DUO · 2 ÜVEG</span><span>PRÉMIUM VÁLASZTÁS</span></div>
            </div>
            <div className="feature-stamp">DUO<br/><small>AJÁNLAT</small></div>
          </div>
        </section>

        <div className="ribbon">HÁROM NÖVÉNY <span>✧</span> PRÉMIUM FOLYÉKONY ESSZENCIA <span>✧</span> MAGYAR KÉSZÍTÉS</div>

        <section className="intro section-pad">
          <div className="intro-visual"><img src={LIFESTYLE_IMAGE} alt="Vital Grape Essence életmódfotó" /><span className="photo-label">A TERMÉSZET ESSZENCIÁJA</span></div>
          <div className="intro-copy">
            <p className="eyebrow">VITAL GRAPE ESSENCE</p>
            <h2>Vannak dolgok,<br/>amikből nem készül <em>átlagos.</em></h2>
            <p>A szőlő, a csipkebogyó és a fekete szeder különböző karaktere találkozik egy sajátos, folyékony étrend-kiegészítőben.</p>
            <div className="metric-row"><div><strong>3</strong><span>meghatározó növény</span></div><div><strong>500</strong><span>ml egy palackban</span></div><div><strong>4</strong><span>cl ajánlott napi adag</span></div></div>
          </div>
        </section>

        <section className="botany section-pad" id="osszetevok">
          <div className="section-heading"><SectionNumber n="01" /><p className="eyebrow gold">AZ ÖSSZETEVŐK VILÁGA</p><h2>Három növény.<br/><em>Egy különleges esszencia.</em></h2><GoldLine /></div>
          <div className="ingredient-grid">{ingredients.map(item => <article className="ingredient-card" key={item.name}><span>{item.count}</span><h3>{item.name}</h3><i>{item.latin}</i><p>{item.description}</p></article>)}</div>
          <p className="fineprint light-fine">Az összetevők bemutatása összetételi tájékoztatás, nem egészséghatás-állítás.</p>
        </section>

        <section className="polyphenols section-pad" id="tudomany">
          <div className="polycopy"><SectionNumber n="02" /><p className="eyebrow">POLIFENOL KISOKOS</p><h2>Mi van a növények<br/><em>színe mögött?</em></h2><p>A polifenolok a növényekben előforduló vegyületek széles csoportját alkotják. A szőlő, a csipkebogyó és a fekete szeder összetételében különböző polifenolos komponensek fordulhatnak elő.</p><p>Az összetétel laboratóriumi elemzése elválik az embereken igazolt egészségügyi hatások bizonyításától.</p><div className="tag-grid"><span>Rezveratrol</span><span>Kvercetin</span><span>Katechinek</span><span>Antociánok</span></div></div>
          <div className="poly-art"><img src={DETAIL_IMAGE} alt="Vital Grape Essence termékrészlet" /><blockquote>„Nem minden érték látszik első pillantásra.”</blockquote></div>
        </section>

        <section className="lab section-pad">
          <SectionNumber n="03" /><p className="eyebrow gold">A LABORATÓRIUM SZEMÉVEL</p><h2>Nem ígéreteket keresünk.<br/><em>Összetevőket.</em></h2><div className="lab-columns"><p>HPLC/UPLC: műszeres analitikai eljárások az összetétel vizsgálatára és egyes komponensek elkülönítésére.</p><div className="lab-callout"><strong>AMIRŐL PONTOSAN BESZÉLHETÜNK</strong><p>A növényi alapanyagokról, a termékformáról, az ajánlott adagról és az ellenőrizhető analitikai eredményekről.</p></div></div><p className="fineprint light-fine">A vegyületnevek és laborvizsgálatok nem bizonyítanak betegséget megelőző vagy gyógyító hatást.</p>
        </section>

        <section className="ritual section-pad"><SectionNumber n="04" /><p className="eyebrow">A NAPI RITUÁLÉ</p><h2>4 cl.<br/><em>Ennyi a napi adag.</em></h2><div className="ritual-layout"><div><p>A címke szerinti napi ajánlott mennyiség 4 centiliter. Egy palack körülbelül 12,5 napi adagot tartalmaz.</p><p>Két palack együtt <strong>25 napi adag</strong> — ezért praktikus választás a dupla csomag a termékkel most ismerkedők számára.</p></div><div className="ritual-number"><strong>25</strong><span>NAPI ADAG A DUPLA CSOMAGBAN</span></div></div></section>

        <section className="closing section-pad">
          <p className="eyebrow gold">PRÉMIUM TERMÉK. SAJÁT KARAKTER.</p><h2>A valódi érték<br/><em>ritkán kérkedik.</em></h2><p>Sötét üveg, karakteres megjelenés, három növényi alapanyag. Nem tömegtermék.</p>
          <div className="closing-offer"><span>KIEMELT DUPLA CSOMAG</span><h3>2 üveg · 49 000 Ft</h3><p>Díjmentes GLS-szállítás · 25 napi adag</p><OfferButton className="button gold-button" /></div>
        </section>

        <section className="faq section-pad" id="kerdesek"><p className="eyebrow">FONTOS INFORMÁCIÓK</p><h2>Jó tudni,<br/><em>mielőtt választ.</em></h2><div className="faq-list">{questions.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      </main>

      <footer className="footer"><div className="footer-logo">V·G·E<small>VITAL GRAPE ESSENCE</small></div><p>A TERMÉSZET ESSZENCIÁJA.</p><div className="footer-disclaimer"><p>Étrend-kiegészítő. Nem helyettesíti a változatos, kiegyensúlyozott étrendet és az egészséges életmódot. A napi ajánlott fogyasztási mennyiséget ne lépje túl. Kisgyermekektől elzárva tartandó.</p><p>A termék 11% (V/V) alkoholt, cukrot és szulfitokat tartalmaz. Gyermekeknek, várandósoknak és alkoholt kerülőknek nem ajánlott. Az aktuális címke és a forgalmazási feltételek ellenőrzendők.</p></div><small>© Vital Grape Essence. Landingoldal-fejlesztési változat, nem élesített ajánlat.</small></footer>
      <div className="mobile-bar"><div><small>DUPLA CSOMAG</small><strong>49 000 Ft</strong></div><OfferButton className="button mobile-button" /></div>
    </>
  );
}
