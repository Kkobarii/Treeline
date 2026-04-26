# Heap Sort

Heap Sort je efektivní třídicí algoritmus založený na porovnávání, který k organizaci dat využívá strukturu maximové haldy (Max-Heap). Algoritmus funguje tak, že nejprve transformuje netříděné pole na haldu a poté opakovaně extrahuje největší prvek z vrcholu haldy a umisťuje ho na konec pole. Tento proces efektivně třídí pole na místě (in-place) bez nutnosti dodatečné paměti typické pro jiné efektivní algoritmy, jako je Merge Sort.

### Vlastnosti

- **Paměť:** In-place. Třídění se provádí přímo v původním poli a vyžaduje pouze pomocnou paměť `O(1)`.
- **Stabilita:** Nestabilní. Proces budování haldy a prohazování kořene s posledním prvkem zahrnuje skoky na dlouhé vzdálenosti, které nezachovávají relativní pořadí stejných prvků.
- **Paradigma:** Transform and Conquer. Algoritmus nejprve transformuje data do specifické struktury (haldy), aby byla následná fáze třídění efektivnější.

### Analýza složitosti

Heap Sort je pozoruhodně konzistentní. Na rozdíl od algoritmu Quick Sort nemá kvadratický nejhorší případ. Bez ohledu na to, zda je vstup roztříděný, roztříděný v opačném pořadí nebo náhodný, algoritmus vždy provádí stejné strukturální transformace a extrakce, a zaručuje tak logaritmickou časovou složitost ve všech případech.

| Nejlepší případ | Průměrný případ | Nejhorší případ | Paměť  |
| :-------------- | :-------------- | :-------------- | :----- |
| `O(n log n)`    | `O(n log n)`    | `O(n log n)`    | `O(1)` |

## Algoritmus

Algoritmus je rozdělen do dvou odlišných fází: vybudování počáteční haldy a následné třídění pomocí extrakce kořene.

### Fáze 1: Vybudování haldy

Cílem je přeskupit netříděné pole do struktury maximové haldy (Max-Heap).

1. **Průchod vnitřními uzly**: Algoritmus začíná od posledního uzlu, který není listem (nachází se na indexu `n/2 - 1`), a postupuje zpět ke kořeni (index 0).
2. **Heapify**: Pro každý uzel se provede operace probublávání dolů ("bubble down"):
    - **Porovnání**: Hodnota uzlu se porovná s jeho levým a pravým potomkem, aby se identifikoval největší z těchto tří prvků.
    - **Prohození**: Pokud je potomek větší než rodič, rodič se s tímto potomkem prohodí.
    - **Rekurzivní kontrola**: Proces pokračuje směrem dolů z prohozené pozice pro zajištění, že vlastnost haldy zůstane zachována v celém podstromu.

### Fáze 2: Třídění (Extrakce a obnova)

Jakmile je Max-Heap vybudována, největší prvek se nachází na indexu 0.

1. **Extrakce kořene**: Prvek na indexu 0 (maximum) se prohodí s posledním prvkem v aktuálně netříděné části pole.
2. **Označení za setříděný**: Prvek nacházející se nyní na konci pole je označen jako trvale setříděný a algoritmus s ním již dále nepracuje.
3. **Obnova haldy**: Vzhledem k přesunu malé hodnoty do kořene je vlastnost haldy porušena. Na kořen se zavolá logika `heapify` (probublávání dolů) pro přesun této nové hodnoty dolů na její správnou pozici, a obnoví se tak Max-Heap pro zbývající netříděné prvky.
4. **Opakování**: Kroky 1-3 se opakují, dokud v nesetříděné části pole nezůstane pouze jeden prvek.

## Poznámky

Heap Sort je vysoce ceněn v systémech, kde je vyžadován zaručený výkon v nejhorším případě a paměť je omezená. Často se používá ve vestavěných (embedded) systémech nebo pro třídění velkých datových sad, které se nevejdou celé do mezipaměti (cache).

**Kdy toto nepoužívat:** Protože má Heap Sort relativně vysoký konstantní faktor ve své časové složitosti, je v praxi u průměrných případů často pomalejší než Quick Sort. Je také vhodné se mu vyhnout v případech, kdy je vyžadováno stabilní třídění.

### Optimalizace

- **Bottom-Up Heapify**: Standardní `heapify` porovnává rodiče se dvěma potomky. Optimalizovaná verze (Floydova verze) dokáže snížit počet porovnání tím, že nejprve probublá dolů k listu a poté probublá náhradní hodnotu zpět nahoru. Tento přístup je statisticky efektivnější pro velké haldy.
- **D-ary Heap**: Zatímco standardní Heap Sort používá binární haldu, použití haldy s více než dvěma potomky na uzel (D-ary heap) může zlepšit výkon mezipaměti zvýšením faktoru větvení a snížením výšky stromu.
