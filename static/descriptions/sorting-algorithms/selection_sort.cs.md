# Selection Sort

Selection Sort je přímočarý třídicí algoritmus, který koncepčně rozděluje pole na setříděnou levou část a nesetříděnou pravou část. Opakovaně prochází nesetříděnou část, aby našel nejmenší hodnotu, a prohodí ji na správnou pozici na konec setříděné části.

### Vlastnosti

- **Paměťová složitost:** In-place. Vyžaduje pouze konstantní množství dodatečné paměti pro uložení ukazatele na index minima.
- **Stabilita:** Nestabilní. Protože algoritmus prohazuje prvky na velké vzdálenosti, aby přesunul minimum na začátek, může snadno přeskočit stejné prvky a narušit jejich původní relativní pořadí.
- **Paradigma:** Hrubá síla (Brute Force) / Inkrementální.

### Analýza složitosti

Na rozdíl od jiných jednoduchých algoritmů je Selection Sort zcela slepý k existujícímu setřídění pole. Vždy musí projít celou zbývající nesetříděnou sekci, aby bylo zaručeno nalezení skutečné minimální hodnoty. Protože jej nelze předčasně ukončit, nejlepší, průměrný i nejhorší případ vyžadují naprosto stejný počet porovnání.

| Nejlepší případ | Průměrný případ | Nejhorší případ | Paměť  |
| :-------------- | :-------------- | :-------------- | :----- |
| `O(n^2)`        | `O(n^2)`        | `O(n^2)`        | `O(1)` |

## Algoritmus

Algoritmus spoléhá na sledování indexů spíše než na neustálé prohazování prvků, výsledkem je maximálně jedno prohození na jeden vnější průchod.

1. **Vnější iterace**: Algoritmus zahájí průchod pro nalezení nejmenšího prvku pro aktuální pozici, počínaje od začátku pole. Vše nalevo je považováno za trvale setříděné. Aktuální index je dočasně zaznamenán jako index minima.
2. **Procházení**: Vnitřní smyčka iteruje zbývající nesetříděnou částí pole a postupuje krok za krokem doprava od aktuální pozice.
3. **Porovnání**: Každý nově procházený prvek se porovná s hodnotou, která se aktuálně nachází na zaznamenaném indexu minima.
4. **Aktualizace minima**: Pokud je procházený prvek ostře menší než zaznamenané minimum, jeho index přepíše zaznamenaný index minima.
5. **Prohození**: Jakmile vnitřní procházení plně dosáhne konce pole, zkontroluje se konečný index minima. Pokud se liší od počátečního indexu průchodu, prvky na těchto dvou indexech se prohodí. Tím se absolutně nejmenší zbývající hodnota uzamkne na své správné setříděné pozici. Vnější iterace se poté posune o jednu pozici vpřed a opakuje se.

## Poznámky

Selection Sort je dobrý algoritmus pro výuku konceptu udržování průběžného minima a pochopení strukturálních omezení nejhoršího případu. Je také pozoruhodný minimalizací celkového počtu operací fyzického zápisu do paměti (prohození), protože nikdy neprovede celkem více než `n` prohození.

**Kdy toto nepoužívat:** Selection Sort by se nikdy neměl používat pro velké datové sady. Dále je třeba se mu vyhnout, pokud by vstupní data mohla již být částečně setříděná, protože jeho rigidní scénář nejlepšího případu `O(n^2)` ho v těchto specifických situacích činí drasticky pomalejším než Insertion Sort nebo optimalizovaný Bubble Sort.

### Optimalizace

Standardní Selection Sort je notoricky obtížné optimalizovat kvůli jeho striktnímu požadavku na procházení všech nesetříděných prvků při každém průchodu.

Běžnou strukturální optimalizací je obousměrný Selection Sort (často označovaný jako Double Selection Sort). Místo pouhého sledování minimální hodnoty vnitřní smyčka současně sleduje minimální i maximální hodnotu. Na konci průchodu je minimum prohozeno na začátek nesetříděné sekce a maximum je prohozeno na konec. Tím se efektivně sníží celkový počet požadovaných vnějších iterací na polovinu, ačkoli základní matematická časová složitost zůstává `O(n^2)`.
