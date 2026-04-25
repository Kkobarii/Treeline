# Porovnání algoritmů

Pohled porovnání poskytuje matici výkonnosti, umožňující pozorovat, jak různé strategie řazení reagují na specifické vzorce dat v poli o velikosti 32. Zatímco O notace poskytuje teoretickou horní mez, skutečný počet porovnání a prohození se může drasticky lišit v závislosti na počátečním stavu dat.

### Přehled výkonnosti

Tato tabulka shrnuje teoretické časové a paměťové složitosti pro šest algoritmů poskytnutých v simulátoru.

| Algoritmus         | Nejlepší případ | Průměrný případ | Nejhorší případ | Paměť      |
| :----------------- | :-------------- | :-------------- | :-------------- | :--------- |
| **Bubble Sort**    | `O(n^2)`        | `O(n^2)`        | `O(n^2)`        | `O(1)`     |
| **Insertion Sort** | `O(n)`          | `O(n^2)`        | `O(n^2)`        | `O(1)`     |
| **Selection Sort** | `O(n^2)`        | `O(n^2)`        | `O(n^2)`        | `O(1)`     |
| **Quick Sort**     | `O(n log n)`    | `O(n log n)`    | `O(n^2)`        | `O(log n)` |
| **Merge Sort**     | `O(n log n)`    | `O(n log n)`    | `O(n log n)`    | `O(n)`     |
| **Heap Sort**      | `O(n log n)`    | `O(n log n)`    | `O(n log n)`    | `O(1)`     |

## Analýza datových sad

Různá rozložení dat zdůrazňují silné stránky a fatální nedostatky různých algoritmů.

### Quick Sort Killer

Quick Sort je obecně jeden z nejrychlejších algoritmů v matici, ale je vysoce citlivý na výběr pivota. Protože tato implementace vybírá jako pivota poslední prvek, datová sada **Reverse** (Reverzně setříděné) představuje jeho absolutně nejhorší případ. Místo rozdělení pole na dvě stejné poloviny pivot pouze „odloupne“ jeden prvek po druhém, následkem toho hloubka rekurze exploduje na `n` a časová složitost degraduje na `O(n^2)`. Ironicky, datová sada **Almost Sorted** (Téměř setříděné) také spouští toto chování nejhoršího případu, jelikož poslední prvek je největší a vede ke stejným nevyváženým rozdělením.

### Slepota algoritmu Selection Sort

Bez ohledu na to, zda jsou data **Shuffled** (Zamíchané), **Almost Sorted** (Téměř setříděné), nebo obsahují mnoho hodnot typu **Duplicates** (Duplikáty), Selection Sort vždy provede stejný počet porovnání. Protože postrádá mechanismus pro předčasné „ukončení“ nebo „přeskočení“, naivně prohledá celou nesetříděnou část při hledání minima, které už možná je na správném místě. Z tohoto důvodu je konzistentně pomalý, avšak jeho výkonnost je velmi předvídatelná.

### Praktický Insertion Sort

Na datech **Almost Sorted** (Téměř setříděné) (kde je mnoho prvků blízko své konečné pozice) je Insertion Sort pozoruhodně rychlý. Rychle „probublá“ prvky o několik pozic zpět a zastaví se. Je však důležité poznamenat, že ačkoliv data mohou pro pozorovatele rychle vypadat setříděně, algoritmus stále provádí nezbytná porovnání, aby se toto ověřilo.

### Merge Sort vs. Paměť

V pohledu porovnání zůstává Merge Sort naprosto konzistentní napříč daty **Sawtooth** (Pilovité), **Shuffled** (Zamíchané) a **Reverse** (Reverzně setříděné). Ačkoliv je neuvěřitelně spolehlivý, problémem může být významné využití pomocného prostoru. Na rozdíl od ostatních algoritmů je Merge Sort out-of-place, to znamená, že je jediný v matici vyžadující značnou dodatečnou paměť pro uložení podpolí během fáze slučování, i když toto není ve vizualizaci explicitně zobrazeno.

## Poznámky

Při porovnávání těchto algoritmů je nutné věnovat velkou pozornost poměru **Porovnání vs. Prohození**:

- **Selection Sort** má nejméně prohození (nejvýše `n`), z toho důvodu je užitečný, pokud je zápis do paměti velmi nákladný.
- **Bubble Sort** má vysoký počet prohození, jelikož přesouvá prvky inkrementálně.
- **Heap Sort** a **Quick Sort** nabízejí nejlepší rovnováhu pro obecné řazení velkého rozsahu, pokud je požadováno řazení na místě (in-place) a stabilita není důležitá.
- **Merge Sort** je primární volbou pro většinu ostatních scénářů, jelikož obvykle překonává ostatní na větších datových sadách.

Pochopení těchto souvislostí je nezbytné pro inženýrství v reálném světě. Většina moderních programovacích jazyků používá „hybridní řazení“ (jako Timsort nebo Introsort). Tyto enginy sledují data a automaticky přepínají mezi těmito algoritmy, například se použije Quick Sort pro velké oddíly, ale přepne se na Insertion Sort, když se datová sada zmenší nebo je téměř setříděná.
