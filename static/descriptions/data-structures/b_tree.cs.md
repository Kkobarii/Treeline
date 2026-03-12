# B-strom

**B-strom** je samovyvažující se stromová datová struktura, která udržuje seřazená data a umožňuje vyhledávání, sekvenční přístup, vkládání a mazání v logaritmickém čase. Na rozdíl od binárních stromů, kde každý uzel má nejvýše dva potomky, B-stromy mohou mít mnohem více potomků na uzel, což je činí zvláště efektivními pro systémy, které čtou a zapisují velké bloky dat, jako jsou databáze a souborové systémy.

### Klíčové vlastnosti

Každý B-strom je definován hodnotou **řádu**, která určuje maximální počet potomků uzlu:

- Každý uzel může obsahovat nejvýše **řád - 1** klíčů
- Každý uzel (kromě kořene) musí obsahovat alespoň **⌈řád/2⌉ - 1** klíčů
- Každý vnitřní uzel (kromě kořene) má alespoň **⌈řád/2⌉** potomků
- Všechny listové uzly jsou na stejné úrovni

Tato struktura zajišťuje, že strom zůstává vyvážený, přičemž všechny cesty od kořene k listu mají stejnou délku.

### Struktura uzlu

Na rozdíl od binárních stromů uzly B-stromu obsahují:

- **Více hodnot**: Pole seřazených klíčů (až řád - 1)
- **Více potomků**: Pole ukazatelů na potomky (až řád)
- **Příznak listu**: Označuje, zda je uzel list nebo vnitřní uzel

Vnitřní uzly mají o jednoho potomka více než mají klíčů, přičemž klíče fungují jako oddělovače mezi podstromy potomků.

## Analýza složitosti

B-stromy udržují vynikající výkon díky minimální výšce stromu prostřednictvím vícecestného větvení:

| Operace    | Nejhorší případ |
| ---------- | --------------- |
| Hledání    | O(log n)        |
| Vložení    | O(log n)        |
| Odstranění | O(log n)        |

Základ logaritmu je určen hodnotou řádu, takže B-stromy s většími hodnotami řádu jsou nižší a širší.

## Vyhledávání (Hledání)

Vyhledávání v B-stromu je podobné binárnímu vyhledávání, ale rozšířené na více klíčů na uzel:

1. **Vyhledávání v uzlu**: Porovnejte cílovou hodnotu s klíči v aktuálním uzlu
2. **Shoda nalezena**: Pokud klíč odpovídá, vrátit úspěch
3. **Přechod na potomka**: Pokud není shoda a nejde o list, určete, který podstrom potomka by měl obsahovat cíl na základě porovnání klíčů
4. **Opakování**: Pokračujte rekurzivně, dokud není nalezeno nebo dosaženo listu

Pokud dosáhneme listu bez nalezení cíle, ve stromu neexistuje.

## Vložení

Vložení udržuje vlastnosti B-stromu proaktivním rozdělováním plných uzlů:

### Fáze 1: Navigace k místu vložení

- Procházejte od kořene k příslušnému listovému uzlu
- Pokud je nalezen plný uzel (řád - 1 klíčů), **rozdělte ho** před sestupem

### Fáze 2: Rozdělení uzlu

Když je uzel plný:

1. **Nalezení mediánu**: Identifikujte prostřední klíč (na indexu ⌈řád/2⌉ - 1)
2. **Vytvoření sourozence**: Vytvořte nový uzel pro horní polovinu klíčů
3. **Povýšení mediánu**: Přesuňte medián nahoru do rodiče
4. **Distribuce klíčů**: Levý uzel si ponechá dolní polovinu, pravý uzel dostane horní polovinu
5. **Distribuce potomků**: Pokud nejde o list, rozdělte odpovídajícím způsobem i potomky

### Fáze 3: Vložení do neplného uzlu

Jakmile jste u neplného listu:

- Vložte nový klíč v seřazeném pořadí
- Strom zůstává vyvážený, protože všechny modifikace probíhají na stejné úrovni

## Odstranění (Smazání)

Odstranění je nejsložitější operace, udržující rovnováhu prostřednictvím půjčování a slučování:

### Případ 1: Klíč v listovém uzlu

Jednoduše odstraňte klíč. Pokud to způsobí, že uzel má příliš málo klíčů (< ⌈řád/2⌉ - 1), přejděte k opravě.

### Případ 2: Klíč ve vnitřním uzlu

Nahraďte buď:

- **Předchůdcem**: Největší klíč v levém podstromu, nebo
- **Následníkem**: Nejmenší klíč v pravém podstromu

Poté rekurzivně odstraňte předchůdce/následníka z jeho původního umístění.

### Případ 3: Potomek má minimální počet klíčů (⌈řád/2⌉ - 1)

Před sestupem k potomku s pouze ⌈řád/2⌉ - 1 klíči zajistěte, aby měl alespoň ⌈řád/2⌉ klíčů:

**Půjčka od sourozence**, pokud má sousední sourozenec ≥ ⌈řád/2⌉ klíčů:

- Přesuňte klíč od rodiče dolů k potomku
- Přesuňte klíč od sourozence nahoru k rodiči
- V případě potřeby přesuňte ukazatel na potomka

**Sloučení se sourozencem**, pokud oba sourozenci mají přesně ⌈řád/2⌉ - 1 klíčů:

- Přesuňte klíč z rodiče dolů
- Spojte potomka, klíč rodiče a sourozence do jednoho uzlu
- Odstraňte klíč rodiče a ukazatel na sourozence z rodiče

### Speciální případ kořene

Pokud odstranění způsobí, že kořen zůstane prázdný:

- Udělejte jediného potomka kořene novým kořenem
- Toto je jediný způsob, jak B-strom snižuje svou výšku

## Proč B-stromy?

B-stromy vynikají ve scénářích, kde jsou data uložena na disku:

- **Minimalizace diskových I/O**: Každý uzel může být dimenzován tak, aby odpovídal diskovému bloku
- **Malá výška**: Více klíčů na uzel znamená méně úrovní k procházení
- **Předvídatelný výkon**: Všechny operace zaručeně O(log n)
- **Rozsahové dotazy**: Sekvenční přístup je efektivní, protože klíče jsou seřazené

To činí B-stromy základem většiny moderních databázových systémů a souborových systémů.
