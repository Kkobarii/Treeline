# Zásobník

Zásobník je jednoduchá lineární datová struktura, která funguje na principu Last-In-First-Out (LIFO). Je navržen tak, aby se prvky přidávaly a odebíraly ze zcela stejného konce, konceptuálně označovaného jako vrchol (top). Kvůli tomuto striktnímu vzoru přístupu je vysoce efektivní, ale záměrně omezený ve své flexibilitě.

### Pravidla

- **Vlastnost LIFO:** Poslední prvek přidaný do zásobníku je matematicky zaručeně prvním prvkem, který bude odebrán.
- **Přístup pouze na vrchol:** Prvky lze přidávat, odebírat nebo prohlížet pouze na samém vrcholu zásobníku. Procházení prvků uprostřed struktury není povoleno.
- **Struktura uzlu:** Interně každý uzel obsahuje hodnotu a referenční ukazatel směřující na další uzel hned pod ním v zásobníku.

### Analýza složitosti

Protože k veškerým úpravám a vyhledáváním dochází striktně na jediném ukazateli na vrchol, nikdy nevzniká potřeba procházet celou strukturu. Výsledkem jsou neuvěřitelně rychlé operace s konstantní časovou složitostí ve všech případech.

| Operace  | Nejhorší případ |
| :------- | :-------------- |
| **Push** | `O(1)`          |
| **Pop**  | `O(1)`          |
| **Peek** | `O(1)`          |

## Push (Vložení)

Vložení nové hodnoty do zásobníku je přímočarý proces vytvoření nového prvku na vrcholu a jeho propojení směrem dolů.

1. **Vytvoření uzlu:** Vygeneruje se nový uzel obsahující poskytnutou hodnotu.
2. **Propojení dalšího:** Ukazatel nového uzlu se nastaví tak, aby odkazoval na aktuální vrcholový uzel zásobníku.
3. **Aktualizace vrcholu:** Primární ukazatel na vrchol zásobníku se aktualizuje tak, aby ukazoval na tento nově vytvořený uzel. Tím se upevní jeho místo na vrcholu.

## Pop (Odebrání)

Odstranění prvku vyžaduje posunutí ukazatele vrcholu směrem dolů a zahození naposledy přidané položky.

1. **Kontrola prázdnoty:** Pokud je zásobník prázdný, operace se zastaví.
2. **Získání hodnoty:** Hodnota aktuálního vrcholového uzlu se získá k navrácení.
3. **Aktualizace vrcholu:** Primární ukazatel na vrchol zásobníku se posune dolů, aby odkazoval na další uzel v sekvenci. Tím se odpojí a odstraní původní vrcholový uzel ze struktury.

## Peek (Nahlédnutí)

Získání hodnoty naposledy přidaného prvku jednoduše zahrnuje prozkoumání vrcholového uzlu bez provádění jakýchkoli strukturálních změn nebo odstraňování prvku ze zásobníku.

## Poznámky

Zásobníky jsou základním konceptem v informatice. Představují mechanismus pro správu volání funkcí v programovacích jazycích (zásobník volání, call stack), vyhodnocování složitých matematických výrazů, sledování historie prohlížeče a implementaci funkcí zpět (undo) v textových editorech.

**Kdy toto NEPOUŽÍVAT:** Zásobníku je vhodné se vyhnout, pokud aplikace vyžaduje zpracování nejstarších dat jako prvních, nebo pokud potřebuje vyhledávat libovolné hodnoty v rámci kolekce. Vyhledávání v zásobníku vyžaduje systematické odebírání a zahazování prvků jen pro dosažení požadované hodnoty. Z tohoto důvodu je tato struktura pro obecné získávání dat vysoce neefektivní.
