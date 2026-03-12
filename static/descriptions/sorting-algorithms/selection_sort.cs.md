# Třídění výběrem

Třídění výběrem rozděluje vstup na seřazenou oblast a neseřazenou oblast. Opakovaně nachází nejmenší (nebo největší) prvek z neseřazené oblasti a přesouvá ho na konec seřazené oblasti. Nazývá se "výběrem", protože vybírá prvky jeden po druhém.

## Jak to funguje

1. Najděte minimální prvek v neseřazené oblasti
2. Prohoďte ho s prvním prvkem neseřazené oblasti
3. Posuňte hranici mezi seřazenou a neseřazenou oblastí o jednu pozici doprava
4. Opakujte, dokud není celé pole seřazené

## Výhody

- **Jednoduché na pochopení**: Přímočarý algoritmus
- **Na místě**: Třídí s O(1) extra prostorem
- **Minimální zápisy**: Provádí pouze n-1 výměn (nejméně mezi O(n²) tříděními)
- **Předvídatelný**: Stejný počet porovnání bez ohledu na pořadí vstupu
- **Dobré pro pomalé zápisy**: Málo zápisů do paměti minimalizuje opotřebení

## Nevýhody

- **Vždy O(n²) porovnání**: Žádná optimalizace nejlepšího případu není možná
- **Nestabilní**: Stejné prvky nezachovávají své původní pořadí
- **Pomalé na velkých datasetech**: Nepraktické pro reálné použití
- **Špatný výkon cache**: Náhodné přístupové vzorce způsobují výpadky cache
- **Žádné adaptivní vlastnosti**: Stejná rychlost na seřazených vs náhodných datech

## Analýza složitosti

| Metrika                       | Složitost                                           |
| ----------------------------- | --------------------------------------------------- |
| **Nejlepší časová složitost** | O(n²) - počet porovnání se nikdy nemění             |
| **Průměrná časová složitost** | O(n²) - náhodná data                                |
| **Nejhorší časová složitost** | O(n²) - obráceně seřazená data                      |
| **Prostorová složitost**      | O(1) - konstantní extra prostor                     |
| **Stabilní**                  | Ne - relativní pořadí stejných prvků není zachováno |

## Kdy použít

- Vzdělávací účely
- Prostředí s pomalými zápisovými operacemi
- Když je minimalizace výměn kritická
- Velmi malé datasety

## Charakteristiky

- **Založené na porovnávání**: Používá porovnávací operace
- **Nerekurzivní**: Iterativní implementace
- **Nestabilní**: Může přeuspořádat stejné prvky
- **Schopné online zpracování**: Může vybrat minimum při čtení vstupu
