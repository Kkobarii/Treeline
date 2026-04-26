# Fronta

Fronta je lineární datová struktura fungující na principu First-In-First-Out (FIFO). Prvky se přidávají na jeden konec a odebírají z druhého konce. Toto uspořádání zajišťuje, že nejstarší prvek ve struktuře je vždy zpracován jako první.

### Pravidla

- **Vlastnost FIFO:** První prvek přidaný do fronty je matematicky zaručeně prvním prvkem, který bude odebrán.
- **Omezený přístup:** Prvky lze přidávat pouze na konec (rear) a odebírat nebo prohlížet pouze na začátku (front). Procházení nebo úprava prvků uprostřed struktury není povolena.
- **Struktura uzlu:** Interně tato struktura využívá formát spojového seznamu, kde každý uzel obsahuje hodnotu a referenční ukazatel směřující na další uzel v sekvenci. Udržují se dva primární ukazatele: `front` (kde se prvky odebírají) a `rear` (kde se prvky přidávají).

### Analýza složitosti

Protože si fronta udržuje přímé ukazatele na začátek i na konec, přidávání a odebírání prvků nevyžaduje procházení sekvence. Výsledkem jsou operace s konstantní časovou složitostí.

| Operace     | Nejhorší případ |
| :---------- | :-------------- |
| **Enqueue** | `O(1)`          |
| **Dequeue** | `O(1)`          |
| **Peek**    | `O(1)`          |

## Enqueue (Vložení)

Přidání nové hodnoty do fronty zahrnuje její připojení na konec a aktualizaci ukazatele `rear`.

1. **Vytvoření uzlu:** Vygeneruje se nový uzel obsahující poskytnutou hodnotu.
2. **Propojení a aktualizace:** Proces propojení závisí na aktuálním stavu fronty:
    - Pokud je fronta prázdná, ukazatele `front` i `rear` se nastaví na tento nový uzel.
    - V opačném případě se ukazatel aktuálního koncového uzlu aktualizuje tak, aby odkazoval na nový uzel, který se stává novým koncem.

## Dequeue (Odebrání)

Odstranění prvku vyžaduje jeho vyjmutí ze začátku a posun ukazatele `front` dále.

1. **Kontrola prázdnoty:** Pokud je fronta zcela prázdná, operace se zastaví.
2. **Získání hodnoty:** Hodnota aktuálního počátečního uzlu se získá k navrácení.
3. **Aktualizace začátku:** Primární ukazatel fronty `front` se posune na další uzel v sekvenci, čímž se odpojí původní počáteční uzel. Pokud toto odstranění zanechá frontu zcela prázdnou, vymaže se také ukazatel `rear`.

## Peek (Nahlédnutí)

Získání hodnoty dalšího prvku v pořadí zahrnuje pouhou kontrolu počátečního uzlu bez provádění jakýchkoli strukturálních změn nebo odstraňování prvku z fronty.

## Poznámky

Fronty jsou zásadní v situacích vyžadujících správu úloh v přesném pořadí, v jakém přicházejí. Představují standardní strukturu pro správu tiskových úloh, obsluhu souběžných požadavků na webovém serveru a provádění prohledávání do šířky (BFS) v komplexních grafových algoritmech.

**Kdy toto nepoužívat:** Frontě je vhodné se vyhnout, pokud aplikace vyžaduje upřednostnění určitých prvků před ostatními na základě jejich hodnoty (to by vyžadovalo prioritní frontu nebo haldu), nebo pokud je nutný okamžitý přístup k naposledy přidaným položkám (pro tyto účely je vhodnější zásobník). Vyhledání konkrétní náhodné hodnoty navíc vyžaduje systematické odebírání a zahazování prvků jen pro dosažení požadované položky. Tato skutečnost činí frontu pro obecné získávání dat vysoce neefektivní.
