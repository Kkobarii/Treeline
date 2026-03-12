# Třídění slučováním

Třídění slučováním je algoritmus typu rozděl a panuj, který rozdělí pole na poloviny, rekurzivně seřadí každou polovinu a poté sloučí seřazené poloviny zpět dohromady. Je známý svým spolehlivým výkonem O(n log n) a stabilním třídicím chováním.

## Jak to funguje

1. **Rozděl**: Rozdělte pole na dvě stejné poloviny
2. **Panuj**: Rekurzivně seřaďte obě poloviny
3. **Sluč**: Zkombinujte dvě seřazené poloviny do jednoho seřazeného pole
    - Porovnejte prvky z každé poloviny
    - Přidejte menší prvek do výsledku
    - Pokračujte, dokud nejsou obě poloviny vyčerpány

## Výhody

- **Zaručené O(n log n)**: Konzistentní výkon bez ohledu na vstup
- **Stabilní třídění**: Zachovává relativní pořadí stejných prvků
- **Předvídatelný**: Žádná degradace nejhoršího případu
- **Paralelizovatelný**: Každá polovina může být tříděna nezávisle
- **Vynikající pro spojové seznamy**: Není potřeba náhodný přístup
- **Externí třídění**: Funguje dobře pro data, která se nevejdou do paměti
- **Adaptivní pro spojové seznamy**: Lepší než třídění na místě pro propojená data

## Nevýhody

- **Vyžaduje O(n) extra prostoru**: Potřebuje pomocné pole pro slučování
- **Pomalejší na malých polích**: Více režie než jednoduché algoritmy
- **Není na místě**: Používá dodatečnou paměť úměrnou velikosti vstupu
- **Nepřátelské k cache**: Nesekvenční přístup do paměti během slučování
- **Přehnané pro malé datasety**: Režie nestojí za přínos

## Analýza složitosti

| Metrika                       | Složitost                           |
| ----------------------------- | ----------------------------------- |
| **Nejlepší časová složitost** | O(n log n) - i se seřazenými daty   |
| **Průměrná časová složitost** | O(n log n) - náhodná data           |
| **Nejhorší časová složitost** | O(n log n) - obráceně seřazená data |
| **Prostorová složitost**      | O(n) - potřeba pomocného pole       |
| **Stabilní**                  | Ano                                 |

## Kdy použít

- Velké datasety, kde záleží na záruce O(n log n)
- Když je vyžadována stabilita
- Třídění spojových seznamů
- Externí třídění (data větší než paměť)
- Scénáře paralelního třídění
- Když musí být ohraničen nejhorší výkon
- Vytváření třídicích sítí

## Varianty

- **Třídění slučováním zdola nahoru**: Iterativní přístup vyhýbající se režii rekurze
- **Třídění slučováním na místě**: Optimalizováno pro snížení extra prostoru (složitá implementace)
- **Adaptivní třídění slučováním**: Rychlejší na částečně seřazených datech

## Použití v reálném světě

Třídění slučováním tvoří základ několika produkčních třídicích algoritmů včetně Timsort (Python, Java) a používá se v online zpracování událostí pro streamovaná data.
