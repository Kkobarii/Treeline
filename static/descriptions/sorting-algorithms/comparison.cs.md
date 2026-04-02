# Porovnání třídících algoritmů

Tento pohled představuje porovnávací matici třídících algoritmů vyhodnocených na různých vstupních distribucích. Je navržen tak, aby ilustroval několik základních pozorování o chování třídění.

## Účel

Matice umožňuje přímé vizuální porovnání toho, jak různé algoritmy reagují na stejné vstupy. Každý řádek představuje jeden algoritmus; každý sloupec představuje jednu třídu vstupních dat. Spuštěním všech simulací současně lze pozorovat relativní výkon a pořadí dokončení.

Demonstrují se následující body:

- **Neexistuje univerzálně optimální algoritmus.** Každý algoritmus vykazuje silné a slabé stránky v závislosti na struktuře vstupu.
- **Asymptotická složitost není jediným kritériem.** Algoritmus s horší nejhorší složitostí může na konkrétních vstupech překonat teoreticky nadřazený algoritmus.
- **Vstupní distribuce je stejně důležitá jako volba algoritmu.** Téměř seřazená, obráceně seřazená a data s mnoha duplikáty mohou významně změnit relativní pořadí výkonu.
- **Stabilita je důležitá.** Algoritmy, které zachovávají relativní pořadí rovných prvků (stabilní algoritmy), jsou upřednostňovány v aplikacích, kde je třeba udržovat sekundární třídící klíče.

## Vlastnosti ideálního třídícího algoritmu

Ideální in-place porovnávací třídění by splňovalo všechna následující kritéria:

1. **Stabilní**: rovné klíče zachovávají své původní relativní pořadí.
2. **In-place**: vyžaduje pouze O(1) pomocné paměti.
3. **Optimální počet porovnání**: provádí O(n log n) porovnání klíčů v nejhorším případě.
4. **Minimální přesuny dat**: provádí O(n) prohozů nebo přesunů v nejhorším případě.
5. **Adaptivní**: dosahuje O(n) času na téměř seřazených nebo málo entropických datech.

Žádný známý algoritmus nesplňuje všech pět vlastností současně. Volba třídícího algoritmu je proto vždy kompromisem diktovaným omezeními dané aplikace.

## Vstupní datové sady

Porovnání používá šest reprezentativních vstupních distribucí:

- **Náhodné**: rovnoměrně zamíchané prvky.
- **Téměř seřazené**: seřazená sekvence s malým počtem sousedních transpozic.
- **Obráceně seřazené**: prvky v sestupném pořadí, představující běžný nejhorší případ.
- **Duplikáty**: malý počet různých hodnot opakovaných v celém poli.
- **Pilový**: opakující se vzestupný vzor produkující periodické lokální uspořádání.
- **Pyramida**: hodnoty vzestupné ke středovému vrcholu a pak sestupné, vytvářející symetrickou strukturu.
