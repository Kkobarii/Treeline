# Třídění vkládáním

Třídění vkládáním sestavuje seřazené pole po jednom prvku. Prochází vstupní pole a pro každý prvek najde správnou pozici v seřazené části a vloží ho tam. Představte si, jak byste mohli třídit hrací karty v ruce - berete karty jednu po druhé a vkládáte je na správnou pozici.

## Jak to funguje

1. Začněte druhým prvkem (první prvek je považován za seřazený)
2. Porovnejte ho s prvky před ním
3. Posuňte větší prvky o jednu pozici doprava
4. Vložte aktuální prvek na jeho správnou pozici
5. Přesuňte se na další prvek a opakujte

## Výhody

- **Jednoduché a intuitivní**: Snadné na pochopení a implementaci
- **Efektivní pro malé datasety**: Velmi rychlé pro seznamy do 50 prvků
- **Online algoritmus**: Může třídit data, jak je přijímá
- **Stabilní třídění**: Zachovává relativní pořadí stejných prvků
- **Na místě**: Vyžaduje pouze O(1) extra prostoru
- **Adaptivní**: Velmi efektivní na téměř seřazených datech (blízko O(n))
- **Dobrá lokalita cache**: Sekvenční přístupové vzorce do paměti

## Nevýhody

- **O(n²) v obecném případě**: Příliš pomalé pro velké datasety
- **Režie posunování**: Přesouvání prvků je nákladnější než prohazování
- **Nevhodné pro externí třídění**: Vyžaduje souvislý přístup k poli

## Analýza složitosti

| Metrika                       | Složitost                       |
| ----------------------------- | ------------------------------- |
| **Nejlepší časová složitost** | O(n) - již seřazená data        |
| **Průměrná časová složitost** | O(n²) - náhodná data            |
| **Nejhorší časová složitost** | O(n²) - obráceně seřazená data  |
| **Prostorová složitost**      | O(1) - konstantní extra prostor |
| **Stabilní**                  | Ano                             |

## Kdy použít

- Třídění malých datasetů nebo podpolí
- Téměř seřazená data, kde záleží na výkonu
- Scénáře online třídění
- Hybridní třídění jako součást algoritmů jako Timsort nebo Introsort
- Když jsou prioritou jednoduchost a paměťová efektivita

## Použití v reálném světě

Třídění vkládáním se často používá v praxi jako základní případ pro algoritmy typu rozděl a panuj. Mnoho efektivních algoritmů jako Timsort a Introsort přepíná na třídění vkládáním pro malá podpole, protože je na malých datasetech rychlejší než složitější algoritmy.
