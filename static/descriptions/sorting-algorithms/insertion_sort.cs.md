# Insertion Sort

Insertion Sort je jednoduchý, intuitivní třídicí algoritmus, který buduje výsledné roztříděné pole po jednom prvku. Konceptuálně rozděluje pole na roztříděnou a netříděnou část. Hodnoty z netříděné části jsou vybírány a umisťovány na správnou pozici v roztříděné části, podobně jako při třídění karet v ruce.

### Vlastnosti

- **Paměť:** In-place. K provedení operací vyžaduje pouze konstantní množství dodatečné paměti.
- **Stabilita:** Stabilní. Pokud mají dva prvky stejnou hodnotu, jejich relativní pořadí zůstává striktně zachováno, protože algoritmus přestane posouvat prvek vzad hned, jakmile narazí na hodnotu, která je menší nebo rovna.
- **Paradigma:** Inkrementální.

### Analýza složitosti

Nejhorší scénář nastává v situaci, kdy je pole setříděno v opačném pořadí. V tomto stavu musí být každý nově vybraný prvek porovnán a prohozen až na samý začátek pole. Tím se maximalizuje počet operací. Naopak, pokud je pole již setříděno, vnitřní smyčka se u každého prvku okamžitě přeruší při prvním porovnání a algoritmus v nejlepším případě dosahuje vysoce efektivního lineárního času.

| Nejlepší případ | Průměrný případ | Nejhorší případ | Paměť  |
| :-------------- | :-------------- | :-------------- | :----- |
| `O(n)`          | `O(n^2)`        | `O(n^2)`        | `O(1)` |

## Algoritmus

Algoritmus spočívá v iteraci přes seznam a neustálém posouvání prvků vzad na jejich správné místo v rostoucí setříděné sekci.

1. **Vnější iterace**: Algoritmus předpokládá, že úplně první prvek (index 0) je již setříděn. Vnější smyčka začíná na indexu 1 a postupuje doprava o jeden prvek najednou, přičemž vybírá další netříděný prvek.
2. **Vnitřní iterace**: Vnitřní smyčka vezme aktuálně vybraný prvek a začne ho porovnávat s setříděnými prvky po jeho levé straně.
3. **Porovnání a prohození**:
    - Pokud je vybraný prvek ostře menší než setříděný prvek po jeho levici, tyto dvě hodnoty se prohodí.
    - Pozornost se poté přesune o jednu pozici doleva a porovnání se opakuje. Toto probublávání vzad pokračuje, dokud prvek nenarazí na předchůdce, který je menší nebo roven, nebo dokud nedosáhne samého začátku pole. V tomto okamžiku prvek našel svou správnou setříděnou pozici a vnější iterace se posune k dalšímu netříděnému prvku.

## Poznámky

Insertion Sort je vysoce efektivní pro velmi malé datové sady nebo pole, která jsou již z velké části setříděna. V praxi pokročilé produkční třídicí algoritmy jako TimSort (používaný v Pythonu a Javě) nebo Introsort ve skutečnosti přepínají na lokalizovaný Insertion Sort v momentě, kdy se jejich netříděné oddíly dostatečně zmenší.

**Kdy toto NEPOUŽÍVAT:** Algoritmu Insertion Sort je vhodné se vyhnout u velkých, zcela náhodných datových sad. Jeho kvadratická časová složitost ho činí příliš pomalým ve srovnání s algoritmy typu rozděl a panuj (divide-and-conquer).

### Optimalizace

Standardní implementace neustále prohazuje prvky, aby posunula hodnotu vzad. Standardní prohození v poli vyžaduje tři operace (s využitím dočasné pomocné proměnné).

Běžnou optimalizací je použití techniky "posunu" (shift) namísto striktního "prohození" (swap). Algoritmus zkopíruje cílový prvek do dočasné proměnné, posune všechny ostře větší prvky o jednu pozici doprava, aby uvolnil místo, a poté umístí cílový prvek do finální uvolněné pozice. Tento postup využívá stejnou třídicí logiku, ale výrazně snižuje celkový počet operací zápisu do paměti.
