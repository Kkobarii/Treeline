# Quick Sort

Quick Sort je vysoce efektivní třídicí algoritmus založený na porovnávání, který využívá strategii rozděl a panuj. Funguje tak, že se z pole vybere prvek zvaný „pivot“ a ostatní prvky se rozdělí do dvou podpolí podle toho, zda jsou menší nebo větší než pivot. Podpole se následně rekurzivně setřídí. Tento proces vede v průměru k velmi rychlému setřídění, a proto z něj činí jeden z nejpoužívanějších třídicích algoritmů v moderní informatice.

### Vlastnosti

- **Paměťová složitost:** In-place. Ačkoliv vyžaduje pomocný prostor `O(log n)` pro zásobník rekurzivních volání, nepotřebuje k uložení dat žádná další pole.
- **Stabilita:** Nestabilní. Proces rozdělování zahrnuje prohazování prvků na velké vzdálenosti. To může změnit relativní pořadí stejných prvků.
- **Paradigma:** Rozděl a panuj.

### Analýza složitosti

Výkon algoritmu Quick Sort silně závisí na výběru pivota. V nejlepším a průměrném případě pivot konzistentně rozděluje pole na zhruba stejné poloviny, vedoucí k logaritmické hloubce. K nejhoršímu scénáři dochází, když je pivot neustále nejmenším nebo největším prvkem (např. při výběru posledního prvku v již setříděném poli). To vede k vysoce nevyváženému stromu s hloubkou `n`.

| Nejlepší případ | Průměrný případ | Nejhorší případ | Paměť      |
| :-------------- | :-------------- | :-------------- | :--------- |
| `O(n log n)`    | `O(n log n)`    | `O(n^2)`        | `O(log n)` |

## Algoritmus

Algoritmus je rozdělen na fázi rozdělování a rekurzivní volání.

### Rozdělování

Cílem této fáze je umístit zvoleného pivota na jeho konečnou setříděnou pozici a zajistit, aby všechny menší prvky byly nalevo od něj a všechny větší prvky napravo.

1.  **Výběr pivota**: V této implementaci se jako pivot vybere poslední prvek aktuálního rozsahu.
2.  **Inicializace hranice**: Index hranice se nastaví na začátek rozsahu. Tento index sleduje pozici, kam by měl být umístěn další prvek menší než pivot.
3.  **Procházení**: Algoritmus iteruje rozsahem od začátku až k prvku těsně před pivotem.
4.  **Porovnání a prohození**: Pro každý prvek při procházení:
    - **Porovnání**: Prvek se porovná s hodnotou pivota.
    - **Prohození**: Pokud je prvek menší nebo roven pivotovi, prohodí se s prvkem na indexu hranice a index hranice se inkrementuje.
5.  **Umístění pivota**: Jakmile je procházení dokončeno, pivot (aktuálně na konci) se prohodí s prvkem na indexu hranice. Pivot je nyní na své konečné, trvale setříděné pozici.

### Rekurze

1.  **Rozdělení**: Index úspěšně umístěného pivota se vrátí do hlavní funkce.
2.  **Volání vlevo**: Funkce Quick Sort se rekurzivně zavolá pro podpole nalevo od pivota (prvky menší než pivot).
3.  **Volání vpravo**: Funkce Quick Sort se rekurzivně zavolá pro podpole napravo od pivota (prvky větší než pivot).
4.  **Základní případ**: Rekurze se zastaví, když má podpole méně než dva prvky, protože je již považováno za setříděné.

## Poznámky

Quick Sort je standardní třídicí algoritmus používaný v mnoha systémech. Například funkce `sort()` v mnoha knihovnách C++ a Java často využívá variantu algoritmu Quick Sort (jako je Dual-Pivot Quicksort).

**Kdy toto nepoužívat:** Algoritmu Quick Sort je třeba se vyhnout, pokud je vyžadována stabilita (zachování pořadí stejných položek). Navíc v systémech kritických z hlediska bezpečnosti, kde by výkon v nejhorším případě `O(n^2)` mohl vést k zamrznutí systému nebo „Denial of Service“ (prostřednictvím datové sady „Quick Sort Killer“), je preferován algoritmus se zaručeným výkonem `O(n log n)`, jako je Merge Sort nebo Heap Sort.

### Optimalizace

Protože je výběr pivota tak důležitý, běžně se používá několik optimalizací, aby se předešlo nejhoršímu případu `O(n^2)`:

- **Medián ze tří (Median-of-Three)**: Místo výběru posledního prvku algoritmus zkontroluje první, prostřední a poslední prvek a jako pivota zvolí jejich medián. To výrazně snižuje šanci na výskyt chování nejhoršího případu u setříděných nebo téměř setříděných dat.
- **Náhodný pivot**: Výběr náhodného indexu pro pivota matematicky znemožňuje, aby konkrétní pevný vzorec dat neustále vyvolával nejhorší scénář.
- **Introsort**: Mnoho produkčních implementací sleduje hloubku rekurze. Pokud hloubka překročí určitou hranici (ukazující na pravděpodobnou cestu `O(n^2)`), algoritmus automaticky přepne na Heap Sort, aby se zaručilo dokončení v `O(n log n)`.
