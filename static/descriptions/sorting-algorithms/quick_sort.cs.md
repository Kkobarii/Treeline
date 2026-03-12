# Rychlé třídění

Rychlé třídění je algoritmus typu rozděl a panuj, který funguje tak, že vybere 'pivotní' prvek a rozdělí pole kolem něj. Prvky menší než pivot jdou doleva a větší prvky jdou doprava. Proces se rekurzivně opakuje na každé části. Je široce používán v praxi díky vynikajícímu průměrnému výkonu a nízké paměťové režii.

## Jak to funguje

1. **Rozdělení**: Vyberte pivot a rozdělte pole
    - Prvky menší než pivot → levá část
    - Prvky větší než pivot → pravá část
2. **Rekurzivní třídění**: Aplikujte rychlé třídění na obě části
3. **Kombinace**: Protože jsou části tříděny na místě, výsledek je seřazené pole

## Výhody

- **Rychlé v praxi**: O(n log n) průměrný případ s dobrými konstantami
- **Třídění na místě**: Pouze O(log n) pomocného prostoru pro rekurzi
- **Přátelské k cache**: Dobrá lokalita reference pro moderní CPU
- **Adaptivní**: Funguje dobře na částečně seřazených datech s dobrou volbou pivotu
- **Rozšířené**: Implementováno ve většině standardních knihoven
- **Založené na porovnávání**: Funguje s jakýmikoli porovnatelnými daty
- **Ocasová rekurze**: Může být optimalizováno pro menší využití zásobníku

## Nevýhody

- **Nejhorší případ O(n²)**: Špatná volba pivotu (jako seřazená data s prvním prvkem jako pivotem)
- **Nestabilní**: Stejné prvky nemusí zachovat původní pořadí
- **Nestabilní výkon**: Silně závisí na volbě pivotu
- **Složitá implementace**: Správná implementace randomizace je složitá
- **Prostor zásobníku**: Rekurze používá O(log n) až O(n) prostoru zásobníku
- **Nezaručeno**: Musí se použít dobrá strategie pivotu pro vyhnutí se O(n²)

## Analýza složitosti

| Metrika                       | Složitost                                               |
| ----------------------------- | ------------------------------------------------------- |
| **Nejlepší časová složitost** | O(n log n) - vyvážené části                             |
| **Průměrná časová složitost** | O(n log n) - náhodná volba pivotu                       |
| **Nejhorší časová složitost** | O(n²) - špatná volba pivotu                             |
| **Prostorová složitost**      | O(log n) - zásobník rekurze (nejlepší), O(n) (nejhorší) |
| **Stabilní**                  | Ne - relativní pořadí stejných prvků není zachováno     |

## Kdy použít

- Obecné třídění velkých datasetů
- Když je průměrný výkon důležitější než nejhorší případ
- Když je paměťový prostor omezený
- Vestavěné systémy a kód kritický na výkon
- S randomizovanou volbou pivotu pro zaručený dobrý výkon

## Strategie volby pivotu

- **První prvek**: Jednoduchý, ale špatný pro seřazená data
- **Náhodný prvek**: Dobrá obecná strategie
- **Medián ze tří**: Lepší pivot za cenu extra porovnání
- **Medián mediánů**: Zaručuje O(n log n), ale pomalejší v praxi

## Vylepšení

- **Randomizace**: Zamíchat data nebo náhodně vybrat pivot
- **3-cestné rozdělení**: Lepší pro duplicitní prvky
- **Introsort**: Přepíná na třídění haldou, pokud je hloubka rekurze příliš velká
- **Přístup Timsort**: Použití třídění vkládáním pro malá podpole

## Použití v reálném světě

Rychlé třídění je základem `qsort()` v C, `sort()` v C++ a je často zabaleno v algoritmech jako Introsort (C++ std::sort), které zaručují O(n log n) nejhorší případ.
