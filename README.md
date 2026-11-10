# Vital Grape Essence – IM8 landing

Mobilra optimalizált, prémium landingoldal a **`lenkei/IM8`** repóban. A kialakítás a jóváhagyott burgundy–fekete–arany látványterv alapján készült.

## Indítás

```bash
npm install
npm run dev
```

- Fő útvonal: `/ajanlat`
- A `/` útvonal a `/ajanlat` oldalra irányít.
- Build: `npm run build`
- A projekt önálló Next.js alkalmazás, **nem a meglévő webshop**.

## Termék és ajánlat

A dupla csomag kommunikált ára 49 000 Ft, két darab 500 ml-es üveggel; a címke szerinti 40 ml-es napi adag alapján összesen 25 napi adag. A GLS-szállításra a megerősített ingyenes ajánlat vonatkozik; a Magyar Posta a webshop jelenlegi szabályai szerint ettől eltérhet.

A kiemelt dupla csomagos nyitókép már az IM8 saját `public/images/vge-dupla-csomag.webp` fájljában található (a korábban feltöltött, azonos nevű eredeti VGE csomagképből). A többi illusztráció továbbra is a `lenkei/vitalgrape-web` nyilvános termékképeire hivatkozik.

## Fontos: kosár- és checkout-integráció MÉG NEM KÉSZ

A webshop `useCart` tárolója a böngésző **`localStorage`**-ében, `vge-cart` néven tartja a tételeket. A külön eredetről futó IM8 landing nem írhatja a `uj.vitalgrapeessence.hu` eredetének tárolóját. A checkout API termék- és ár-azonosítókhoz kötött. A kétpalackos kosárba tételt **nem szabad** puszta, ellenőrizetlen URL-paraméterrel működőnek nevezni.

A megoldáshoz a webshopban egy szerveroldali, biztonságos checkout-bridge útvonal szükséges, amely:

1. A `offer=vge-double` ajánlatot szerveroldalon feloldja egy **aktív, 2 palackot tartalmazó, egyszeri** ársorra.
2. Készletet és aktuális összeget ellenőriz, és nem fogad el kliensből tetszőleges árat/termékazonosítót.
3. Behelyezi a csomagot a webshop tényleges kosárállapotába, majd a **/checkout** oldalra visz.
4. A meglévő Meta/GA4 attributiont és az `utm_*` paramétereket megőrzi.
5. Csak HTTPS-en működik, és nem enged tetszőleges visszairányítási URL-t.

Ha ilyen integráció rendelkezésre áll, állítsd be az IM8 Vercel projektben a `NEXT_PUBLIC_VGE_CHECKOUT_BRIDGE_URL` változót a bridge teljes HTTPS-URL-jére. A CTA ekkor ezt az útvonalat hívja `offer=vge-double&quantity=1` paraméterrel; `quantity=1` **egy kétpalackos csomagot** jelent.

Ha nincs megadva bridge, a gomb **őszintén** „Megnézem a dupla csomagot” felirattal a `NEXT_PUBLIC_VGE_PRODUCT_URL` termékoldalra irányít, nem állítja, hogy a termék már kosárban van.

**Árszinkron:** a korábbi webshopforrásokban a kétpalackos ársor 49 900 Ft-ként szerepelt. Az élesített, 49 000 Ft-os hirdetési árhoz ellenőrizni kell, hogy a webshop adatbázisában lévő releváns ársor tényleg **49 000 Ft**, különben a pénztárnál eltérő összeg jelenhet meg.

## Domain és élesítés

A tervezett cím: `https://vitalgrapeessence.hu/ajanlat`. A repóban lévő fájlok önmagukban nem állítják át a domaint. Vercel projekt, megfelelő domain-routing (illetve szükség esetén a meglévő oldal szerveroldali rewrite-ja) és DNS-beállítás szükséges. Élesítést csak tesztelt checkout után javasolt végezni.

## Indítás előtti ellenőrzések

- Országonkénti / szállítási módonkénti díj, 49 000 Ft-os ár, készlet és checkout tesztek.
- Meta Pixel és GA4 vásárlási események, UTM-öröklés ellenőrzése.
- Az „ezt választják a legtöbben” állítás csak igazolható rendelési adatokkal maradhat.
- NNGYK/címke/alkoholtartalom és forgalmazási státusz, valamint minden étrend-kiegészítő reklámállítás jogi ellenőrzése.

Ez fejlesztői változat, nem élesített oldal vagy kész fizetési integráció.


## Kaparós 11%-os kupon – automatikus megjelenés 60 másodperc után

A `components/ScratchCouponPopup.jsx` modul a `/ajanlat` landingoldal **minden új megnyitásától számított 60 másodperc** után felugrik. A korábbi változatban a popup tévesen nem jelent meg, ha a `NEXT_PUBLIC_VGE_SCRATCH_COUPON_CODE` Vercel-környezeti változó hiányzott, illetve ha az adott munkamenetben már egyszer megnyílt. Ezeket a korlátokat megszüntettük.

**Kupon:** `CSOPORT11` — a webshophoz a felhasználó által megerősített, létező 11%-os kód. A kód a kliensben szándékosan publikus, és **nem** igényel környezeti változót. Az igazi kedvezményt a webshop szerveroldali kuponellenőrzése érvényesíti. A kupon hatókörét (1/2/3/6 palackos egyszeri csomagok) a webshop adminjában kell fenntartani; előfizetésre a meglévő rendszer nem fogad el kuponokat.

**Animáció:** az ajánlati modál függönyként felülről leereszkedik, az alsó szegélye enyhén hullámzik, majd 1,8 másodperc alatt kisimul és nyugalomba kerül. A csökkentett animációt igénylő felhasználóknál azonnal, animáció nélkül jelenik meg. Telefonon ujjal, asztali gépen egérrel és érintőtollal kaparható. 35% lekaparása után teljesen felfedi a kódot. Képernyőolvasót és billentyűzetet használók számára azonnali felfedő gomb is elérhető.

Az ablak bezárható és a jobb alsó sarokban ismét megnyitható. A 60 másodperces időzítés **minden új oldalletöltésnél** újraindul; ha a lap nem látható, az eltelt idő után a következő láthatóvá váláskor jelenik meg. A kaparás játékos megjelenítés, minden résztvevő ugyanazt a 11%-os kedvezményt kapja: nem véletlenszerű sorsolás. A „mai nyeremény” reklámszöveg nem jelent automatikus aznapi lejáratot.

**Éles beváltásellenőrzés:** az IM8 projekt csak megjeleníti és másolja a kódot; a webshop egy-, két-, három- és hatpalackos egyszeri csomagjainál külön ajánlott tesztelni a kupon 11%-os érvényesítését a pénztárban. A popup felfedése és a rendelés tényleges kedvezményének beváltása két külön esemény.
