# Bublinkové třídění

Bublinkové třídění je jeden z nejjednodušších třídicích algoritmů. Opakovaně prochází seznam, porovnává sousední prvky a prohodí je, pokud jsou ve špatném pořadí. Tento proces pokračuje, dokud není seznam seřazený. Algoritmus dostal své jméno, protože menší prvky "probublávají" na začátek seznamu s každým průchodem.

## Jak to funguje

1. Porovnejte první dva prvky
2. Pokud je první větší než druhý, prohoďte je
3. Přesuňte se na další pár a opakujte
4. Po každém úplném průchodu je největší neseřazený prvek na své konečné pozici
5. Opakujte, dokud nejsou potřeba žádné další výměny

## Výhody

- **Jednoduché na pochopení a implementaci**: Ideální pro učení konceptů třídění
- **Není potřeba extra prostor**: Třídí na místě s O(1) dodatečným prostorem
- **Stabilní třídění**: Zachovává relativní pořadí stejných prvků
- **Adaptivní**: Může být optimalizováno pro detekci již seřazených dat
- **Založené na porovnávání**: Funguje s jakýmikoli porovnatelnými daty

## Nevýhody

- **Velmi pomalé na velkých datasetech**: Časová složitost O(n²) ho činí nepraktickým pro reálné použití
- **Mnoho zbytečných porovnání**: I když je seznam většinou seřazený, pokračuje v porovnávání
- **Špatný výkon cache**: Náhodné přístupy do paměti škodí výkonu moderních CPU
- **Nepoužívá se v praxi**: Pro téměř všechny scénáře existují lepší algoritmy

## Analýza složitosti

| Metrika                       | Složitost                          |
| ----------------------------- | ---------------------------------- |
| **Nejlepší časová složitost** | O(n) - již seřazeno s optimalizací |
| **Průměrná časová složitost** | O(n²) - typická náhodná data       |
| **Nejhorší časová složitost** | O(n²) - obráceně seřazená data     |
| **Prostorová složitost**      | O(1) - konstantní extra prostor    |
| **Stabilní**                  | Ano                                |

## Kdy použít

- Vzdělávací účely a učení konceptů třídění
- Extrémně malé datasety (< 10 prvků)
- Téměř seřazená data s optimalizacemi

## Optimalizace

- **Předčasné ukončení**: Zastavit, pokud v průchodu nedojde k žádné výměně
- **Zmenšený rozsah**: Sledovat pozici poslední výměny pro vyhnutí se redundantním porovnáním
