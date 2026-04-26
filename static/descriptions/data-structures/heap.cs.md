# Halda

Halda je specializovaná datová struktura založená na stromech, která splňuje specifickou vlastnost uspořádání. Ačkoli je vizualizována jako binární strom, interně je typicky implementována jako zploštělé, jednorozměrné pole. Tato struktura je vysoce efektivní pro neustálé získávání prvku s nejvyšší (nebo nejnižší) prioritou z dynamicky se měnící datové sady, což z ní činí základní strukturu pro prioritní fronty.

Na základě specifické logiky, kde rodičovské uzly musí být větší než jejich potomci, se v této implementaci jedná o maximovou haldu (Max-Heap).

### Pravidla

- **Vlastnost tvaru:** Strom musí být úplný binární strom. To znamená, že každá úroveň stromu je plně obsazena uzly, s výjimkou úplně poslední úrovně, která musí být zaplněna zleva doprava bez jakýchkoli mezer.
- **Vlastnost haldy:** Pro maximovou haldu platí, že hodnota jakéhokoli daného uzlu musí být vždy větší nebo rovna hodnotám jeho potomků. To zaručuje, že největší hodnota v celé struktuře se vždy nachází v kořeni.
- **Mapování na pole:** Protože je strom dokonale úplný, lze jej matematicky namapovat na pole. Uzel na daném indexu `i` vždy najde svého levého potomka na `2i + 1`, svého pravého potomka na `2i + 2` a svého rodiče na `(i - 1) / 2` zaokrouhleno dolů.

### Analýza složitosti

Protože je tvar úplného binárního stromu striktně vynucován, je strom vždy dokonale vyvážený, tak, jak má všechno být. Výška je matematicky omezena na `O(log n)`. Nalezení maximálního prvku je extrémně rychlé, protože se vždy jedná o kořen, ale úprava haldy vyžaduje průchod nahoru nebo dolů po výšce stromu za účelem obnovení pravidel.

| Operace               | Nejhorší případ |
| :-------------------- | :-------------- |
| **Nahlédnutí (Peek)** | `O(1)`          |
| **Vložení**           | `O(log n)`      |
| **Extrakce kořene**   | `O(log n)`      |

## Vložení

Vložení nové hodnoty ji přidá na dno stromu, aby se zachovala vlastnost tvaru, a poté ji probublá směrem nahoru, aby se obnovila vlastnost haldy.

1. **Připojení:** Nová hodnota se přidá do úplně nejnižší úrovně stromu na další dostupné místo zleva. V reprezentaci pole to jednoduše znamená připojení hodnoty na konec seznamu.
2. **Porovnání:** Nově přidaný uzel se porovná se svým rodičem.
3. **Probublávání nahoru:** Pokud je nová hodnota větší než její rodič, oba uzly se prohodí. V tomto procesu porovnávání a prohazování směrem nahoru se pokračuje, dokud uzel není menší než jeho rodič, nebo dokud nedosáhne pozice kořene.

## Nahlédnutí (Peek)

Získání maximální hodnoty jednoduše zahrnuje prozkoumání kořenového uzlu na vrcholu stromu bez změny struktury.

## Extrakce kořene

Protože největší hodnota je vždy v kořeni, je její extrakce snadná. Složitost spočívá v opravě díry, která zůstane na vrcholu stromu, aniž by došlo k porušení pravidel tvaru nebo uspořádání.

1. **Prohození:** Vezme se naposledy vložený listový uzel (nejspodnější uzel nejvíce vpravo) a prohodí se jeho pozice s kořenovým uzlem.
2. **Smazání:** Původní kořenový uzel (který se nyní nachází na dně stromu) se ze struktury zcela odstraní a vrátí se jeho hodnota.
3. **Porovnání:** Počínaje nově umístěným kořenem se porovná jeho hodnota s hodnotami jeho levého i pravého potomka, aby se našla největší z těchto tří hodnot.
4. **Probublávání dolů:** Pokud je jeden nebo oba potomci větší než aktuální uzel, aktuální uzel se prohodí s největším potomkem. V tomto procesu porovnávání a prohazování směrem dolů se pokračuje, dokud není uzel větší než oba jeho potomci, nebo dokud se nestane listovým uzlem na dně stromu.
5. **Prázdná halda:** Pokud dojde k pokusu o extrakci na zcela prázdné haldě, operace se zastaví a je zahozena.

## Poznámky

Haldy jsou základním motorem pro algoritmy jako je heapsort nebo pro prioritní fronty, a jsou hojně využívány v grafových algoritmech, jako je Dijkstrův algoritmus nejkratší cesty, nebo při plánování úloh v operačních systémech.

**Kdy toto nepoužívat:** Haldu není vhodné použít, pokud aplikace vyžaduje vyhledávání libovolných hodnot. Protože je halda seřazena pouze vertikálně (rodiče jsou větší než potomci) a nemá žádné horizontální uspořádání (leví potomci nejsou ostře menší než praví potomci), nalezení specifické náhodné hodnoty vyžaduje plné lineární skenování celé struktury `O(n)`.
