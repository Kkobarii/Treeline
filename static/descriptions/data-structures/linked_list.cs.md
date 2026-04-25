# Spojový seznam

Spojový seznam je lineární datová struktura, ve které nejsou prvky uloženy v souvislých paměťových lokacích. Místo toho je každý prvek nezávislý objekt, který ukazuje na další v pořadí. Tato struktura umožňuje dynamickou alokaci paměti, což znamená, že seznam může snadno růst a zmenšovat se, aniž by bylo nutné kopírovat prvky do nového bloku paměti jako v případě standardního pole.

### Pravidla

- **Struktura uzlu:** Každý jednotlivý prvek v seznamu se nazývá uzel. Uzel obsahuje dvě informace: samotnou uloženou hodnotu a referenční ukazatel na další uzel v sekvenci.
- **Struktura seznamu:** Samotný seznam je definován jediným počátečním ukazatelem nazývaným `head` (hlavička), který ukazuje na úplně první uzel. Poslední uzel v sekvenci má ukazatel, který ukazuje na hodnotu `null`, značící konec seznamu.
- **Ukazatel na konec:** Ačkoli základní spojový seznam vyžaduje pouze ukazatel na hlavičku, tato implementace udržuje také ukazatel `tail` (konec), který přímo odkazuje na úplně poslední uzel. Tento přídavek umožňuje okamžitý přístup na konec seznamu.

### Analýza složitosti

Efektivita spojového seznamu je vysoce závislá na tom, kde operace probíhá. Přístup k prvkům na začátku nebo na konci je neuvěřitelně rychlý. Protože však neexistuje způsob, jak skočit přímo na konkrétní index, vyhledání nebo úprava prvku uprostřed vyžaduje postupný průchod krok za krokem od začátku, což vede k lineární časové složitosti.

| Operace                | Nejhorší případ |
| :--------------------- | :-------------- |
| **Vložení na začátek** | `O(1)`          |
| **Vložení na konec**   | `O(1)`\*        |
| **Nalezení**           | `O(n)`          |
| **Odebrání**           | `O(n)`          |

_\*Tato konstantní časová složitost platí pouze tehdy, když je udržován ukazatel na konec. Pokud není udržován žádný ukazatel na konec, operace vyžaduje průchod celým seznamem, a to vede ke složitosti `O(n)`._

## Vložení na začátek

Vložení nové hodnoty na začátek seznamu vyžaduje pouze několik aktualizací ukazatelů a nevyžaduje posun žádných jiných prvků.

1. **Vytvoření uzlu:** Vygeneruje se nový uzel obsahující poskytnutou hodnotu.
2. **Propojení dalšího:** Ukazatel nového uzlu se nastaví tak, aby odkazoval na aktuální hlavičku seznamu.
3. **Aktualizace hlavičky:** Hlavní ukazatel na hlavičku seznamu se aktualizuje tak, aby ukazoval na nově vytvořený uzel. Pokud byl seznam dříve prázdný, aktualizuje se také ukazatel na konec tak, aby ukazoval na tento jediný uzel.

## Vložení na konec

Připojení nové hodnoty na konec seznamu je optimalizováno na konstantní čas `O(1)`, protože struktura udržuje přímý ukazatel na konec.

1. **Vytvoření uzlu:** Vygeneruje se nový uzel obsahující poskytnutou hodnotu.
    - Pokud není udržován ukazatel na konec, seznam se musí nejprve projít od hlavičky, aby se našel aktuální poslední uzel, než může dojít k vložení.
2. **Propojení dalšího:** Pokud je seznam prázdný, ukazatele na hlavičku i na konec se nastaví na tento nový uzel. V opačném případě se ukazatel aktuálního koncového uzlu aktualizuje tak, aby odkazoval na nový uzel.
3. **Aktualizace konce:** Hlavní ukazatel na konec seznamu se aktualizuje tak, aby ukazoval na nově vytvořený uzel.

## Nalezení

Vyhledávání konkrétní hodnoty zahrnuje lineární skenování začínající od uzlu hlavičky, postupné procházení každého následujícího ukazatele a porovnávání hledané hodnoty s hodnotou uvnitř každého uzlu na cestě, dokud není nalezena shoda nebo není dosaženo terminátoru `null` na konci seznamu.

## Odebrání

Odebrání uzlu vyžaduje nalezení cíle a přepojení okolních uzlů, aby se smazaný prvek obešel bez přerušení řetězce.

1. **Kontrola prázdnoty:** Pokud je seznam prázdný, operace se zastaví.
2. **Odstranění hlavičky:** Pokud se cílová hodnota nachází v uzlu hlavičky, ukazatel na hlavičku se aktualizuje tak, aby odkazoval na druhý uzel v sekvenci, a původní hlavička se zahodí. Pokud toto odstranění zanechá seznam zcela prázdný, vymaže se také ukazatel na konec.
3. **Průchod a odstranění:** Pokud cíl není hlavičkou, seznamem se iteruje přes uzly, přičemž se udržuje přehled o aktuálním uzlu i předchozím uzlu:
    - Pokud se cíl shoduje s aktuálním uzlem, ukazatel předchozího uzlu se aktualizuje tak, aby obešel aktuální uzel a ukazoval přímo na další uzel. Pokud byl odstraněný uzel náhodou koncem, ukazatel na konec seznamu se aktualizuje tak, aby odkazoval na předchozí uzel.
    - Pokud se cíl neshoduje, předchozí i aktuální ukazatel se posunou o jeden krok vpřed v sekvenci.
4. **Nenalezeno:** Pokud je dosaženo konce seznamu, aniž by byla nalezena odpovídající hodnota, operace skončí bez provedení jakýchkoli strukturálních změn.

## Poznámky

Zde popsaný standardní spojový seznam je jednosměrně spojový, což znamená, že navigace může probíhat pouze jedním směrem od hlavičky ke konci.

Existují dvě velmi běžné varianty této struktury. Obousměrně spojový seznam přidává do každého uzlu druhý ukazatel, který ukazuje zpět na předchozí uzel, což umožňuje průchod oběma směry za cenu mírně vyššího využití paměti. Kruhový spojový seznam připojuje poslední koncový uzel zpět k uzlu hlavičky místo k hodnotě `null`, čímž vytváří uzavřenou smyčku, která je obzvláště užitečná pro úlohy vyžadující nepřetržité cyklení, jako je plánování procesů (round-robin) v operačním systému.
