# Spojový seznam

**Spojový seznam** je základní lineární datová struktura skládající se ze sekvence uzlů, kde každý uzel obsahuje hodnotu a odkaz (neboli "link") na další uzel v sekvenci. Na rozdíl od polí spojové seznamy neukládají prvky v souvislých paměťových místech, což je činí vysoce dynamickými a efektivními pro určité operace.

Klíčové charakteristiky jednosměrného spojového seznamu jsou:

- Každý **uzel** obsahuje datovou hodnotu a ukazatel na **další uzel**.
- První uzel se nazývá **hlava**.
- Poslední uzel ukazuje na `null`, což označuje konec seznamu.
- Prvky mohou být efektivně vkládány nebo odstraňovány bez reorganizace celé struktury.

Tato struktura umožňuje dynamickou alokaci paměti, což ji činí zvláště užitečnou, když je velikost datové struktury neznámá nebo se často mění.

## Analýza složitosti

Efektivita operací spojového seznamu závisí na pozici prvku, ke kterému se přistupuje nebo který se modifikuje:

| Operace            | Průměrný případ | Nejhorší případ |
| ------------------ | --------------- | --------------- |
| Přístup            | O(n)            | O(n)            |
| Vyhledávání        | O(n)            | O(n)            |
| Vložení na začátek | O(1)            | O(1)            |
| Vložení na konec   | O(1)\*          | O(1)\*          |
| Odstranění         | O(n)            | O(n)            |

_\*S udržovaným ukazatelem na konec. Bez něj vyžaduje vložení na konec O(n) průchod._

## Struktura uzlu

Každý uzel v jednosměrném spojovém seznamu obsahuje:

- **Hodnota**: Data uložená v uzlu
- **Další**: Odkaz/ukazatel na další uzel v sekvenci

Samotný seznam udržuje:

- **Hlava**: Odkaz na první uzel
- **Konec**: (Volitelně) Odkaz na poslední uzel pro O(1) vkládání na konec
- **Velikost**: (Volitelně) Počet uzlů v seznamu

## Vložení na začátek

Vkládání na začátek spojového seznamu je operace s konstantním časem (O(1)), protože nevyžaduje procházení seznamu.

1. **Vytvoření nového uzlu**: Alokujte nový uzel s danou hodnotou.
2. **Kontrola prázdného seznamu**:
    - Pokud je seznam prázdný (hlava je `null`), nastavte hlavu i konec na nový uzel.
    - Pokud seznam není prázdný, pokračujte krokem 3.
3. **Propojení nového uzlu**: Nastavte ukazatel `další` nového uzlu na aktuální hlavu.
4. **Aktualizace hlavy**: Aktualizujte odkaz na hlavu tak, aby ukazoval na nový uzel.

Nový uzel se stane prvním prvkem v seznamu a všechny existující uzly se posunou o jednu pozici dolů.

## Vložení na konec

Vkládání na konec může být optimalizováno na O(1) při udržování ukazatele na konec.

1. **Vytvoření nového uzlu**: Alokujte nový uzel s danou hodnotou.
2. **Kontrola prázdného seznamu**:
    - Pokud je seznam prázdný (hlava je `null`), nastavte hlavu i konec na nový uzel.
    - Pokud seznam není prázdný, pokračujte krokem 3.
3. **Propojení z aktuálního konce**: Nastavte ukazatel `další` aktuálního konce na nový uzel.
4. **Aktualizace konce**: Aktualizujte odkaz na konec tak, aby ukazoval na nový uzel.

Bez ukazatele na konec tato operace vyžaduje O(n) času pro průchod na konec seznamu.

## Vyhledávání (Hledání)

Vyhledávání ve spojovém seznamu vyžaduje sekvenční přístup od hlavy.

1. **Začátek u hlavy**: Začněte procházení u hlavového uzlu.
2. **Kontrola prázdného seznamu**: Pokud je seznam prázdný, vrátit nenalezeno.
3. **Porovnání hodnot**: Porovnejte hledanou hodnotu s hodnotou aktuálního uzlu.
4. **Shoda nalezena**: Pokud se hodnoty shodují, vrátit uzel (úspěch).
5. **Přechod na další**: Pokud není shoda a existuje další uzel, přejděte na další uzel a opakujte od kroku 3.
6. **Konec seznamu**: Pokud je dosažen konec bez nalezení hodnoty, vrátit nenalezeno.

Na rozdíl od binárních vyhledávacích stromů spojové seznamy vyžadují lineární vyhledávání, protože neudržují seřazené pořadí ani neumožňují náhodný přístup.

## Odstranění (Smazání)

Odstranění uzlu ze spojového seznamu vyžaduje nalezení uzlu a aktualizaci ukazatelů.

### Speciální případ: Odstranění hlavy

1. **Kontrola shody hlavy**: Pokud hlavový uzel obsahuje cílovou hodnotu.
2. **Aktualizace hlavy**: Nastavte hlavu na další uzel hlavy.
3. **Aktualizace konce**: Pokud se seznam stane prázdným, nastavte také konec na `null`.

### Obecný případ: Odstranění ze středu nebo konce

1. **Procházení**: Začněte od hlavy, sledujte předchozí uzel.
2. **Porovnání**: Zkontrolujte hodnotu každého uzlu oproti cíli.
3. **Nalezeno**: Když je nalezeno:
    - Aktualizujte ukazatel `další` předchozího uzlu tak, aby přeskočil aktuální uzel (ukazuje na current.next).
    - Pokud odstraňujete konec, aktualizujte odkaz na konec na předchozí uzel.
4. **Nenalezeno**: Pokud procházení skončí bez nalezení hodnoty, ohlaste nenalezeno.

Klíčem k odstranění je udržení řetězce odkazů tím, že předchozí uzel "přeskočí" odstraňovaný uzel.

## Výhody

- **Dynamická velikost**: Může růst nebo se zmenšovat během běhu bez předalokace.
- **Efektivní vkládání/mazání**: Přidání nebo odstranění prvků na začátku je O(1).
- **Paměťově efektivní**: Alokuje paměť pouze podle potřeby pro každý prvek.
- **Žádný plýtvaný prostor**: Na rozdíl od polí nerezervuje nevyužitou kapacitu.

## Nevýhody

- **Žádný náhodný přístup**: Nelze přímo přistupovat k n-tému prvku; vyžaduje O(n) průchod.
- **Extra paměť**: Každý uzel vyžaduje další paměť pro ukazatel na další.
- **Sekvenční přístup**: Horší lokalita cache ve srovnání s poli.
- **Nelze efektivně vyhledávat**: Žádná možnost binárního vyhledávání, ani když je seřazený.

## Varianty

- **Obousměrný spojový seznam**: Každý uzel má ukazatele `další` i `předchozí`, což umožňuje obousměrné procházení.
- **Kruhový spojový seznam**: Poslední uzel ukazuje zpět na první uzel místo `null`.
- **Obousměrný kruhový spojový seznam**: Kombinuje obě varianty pro obousměrné kruhové procházení.

## Běžné případy použití

- **Dynamická alokace paměti**: Když je počet prvků neznámý nebo se výrazně mění.
- **Implementace zásobníků a front**: Efektivní pro operace push/pop.
- **Funkce zpět (Undo)**: V aplikacích, kde je potřeba vrátit operace.
- **Seznamy sousedů grafů**: Efektivní reprezentace řídkých grafů.
- **Polynomická aritmetika**: Reprezentace a manipulace s polynomy.
