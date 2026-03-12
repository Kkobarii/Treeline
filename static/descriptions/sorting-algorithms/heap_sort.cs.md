# Třídění haldou

Třídění haldou používá datovou strukturu haldy k třídění prvků. Sestaví max-haldu, poté opakovaně extrahuje maximální prvek (kořen haldy) a umístí ho na konec seřazené části. Algoritmus zaručuje O(n log n) výkon v nejhorším případě při třídění na místě.

## Jak to funguje

1. **Sestavení haldy**: Sestavte max-haldu ze vstupního pole
2. **Extrakce**: Opakovaně extrahujte kořen (maximální prvek)
3. **Umístění**: Přesuňte extrahované maximum na konec seřazené části
4. **Obnovení**: Přestavte haldu se zbývajícími neseřazenými prvky
5. **Opakování**: Pokračujte, dokud halda neobsahuje pouze jeden prvek

## Výhody

- **Zaručené O(n log n)**: Žádná degradace nejhoršího případu jako u rychlého třídění
- **Třídění na místě**: Potřeba pouze O(1) extra prostoru
- **Žádné výjimečné případy**: Vždy funguje dobře bez ohledu na vstup
- **Předvídatelný**: Nejhorší případ se rovná průměrnému případu
- **Paměťově efektivní**: Nevyžaduje pomocná pole
- **Dobrý pro velké datasety**: Spolehlivý výkon za všech podmínek

## Nevýhody

- **Pomalejší v praxi**: Větší konstantní faktory než rychlé třídění
- **Špatný výkon cache**: Nesekvenční přístupové vzorce do paměti
- **Nestabilní**: Stejné prvky mohou být přeuspořádány
- **Složitá implementace**: Operace s haldou jsou méně intuitivní
- **Vyšší režie**: Údržba haldy vyžaduje více operací
- **Neadaptivní**: Žádné zlepšení na částečně seřazených datech
- **Nepřátelské k cache**: Náhodný přístup do paměti škodí moderním CPU

## Analýza složitosti

| Metrika                       | Složitost                                           |
| ----------------------------- | --------------------------------------------------- |
| **Nejlepší časová složitost** | O(n log n) - všechny případy jsou stejné            |
| **Průměrná časová složitost** | O(n log n) - konzistentní výkon                     |
| **Nejhorší časová složitost** | O(n log n) - zaručeno                               |
| **Prostorová složitost**      | O(1) - konstantní extra prostor                     |
| **Stabilní**                  | Ne - relativní pořadí stejných prvků není zachováno |

## Kdy použít

- Když je povinný nejhorší případ O(n log n)
- Real-time systémy vyžadující předvídatelný výkon
- Prostředí s omezenou pamětí
- Když stabilita není požadována
- Potřeba zaručeného výkonu nad optimalizací průměrného případu

## Operace haldy

- **Heapify**: O(log n) - obnovení vlastnosti haldy
- **Sestavení haldy**: O(n) - vytvoření haldy z pole
- **Extrakce maxima**: O(log n) - odstranění a reorganizace

## Charakteristiky

- **Založené na porovnávání**: Používá porovnání pro řazení
- **Na místě**: Třídí bez extra prostoru pro pole
- **Iterativní**: Může být implementováno bez rekurze
- **Úplný binární strom**: Efektivní reprezentace polem

## Případy použití v reálném světě

- Implementace prioritních front
- Vestavěné systémy vyžadující předvídatelné časování
- Real-time aplikace s přísnými deadliny
- Součást Introsort (záložní řešení C++ když je rychlé třídění nestabilní)
- Problémy výběru (nalezení k-tého nejmenšího/největšího)

## Optimalizační techniky

- **Heapify zdola nahoru**: Mírně rychlejší heapifikace
- **Snížené porovnání**: Přesná varianta minimalizuje porovnání
- **Optimalizace cache**: Specifická rozložení haldy pro lepší využití cache
