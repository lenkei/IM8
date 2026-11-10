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
