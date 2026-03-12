# Binární vyhledávací strom (BST)

**Binární vyhledávací strom (BST)** je základní hierarchická datová struktura používaná pro efektivní ukládání a vyhledávání dat. Skládá se z uzlů, kde každý uzel obsahuje hodnotu a až dva "potomky", typicky označované jako levý potomek a pravý potomek.

Definující charakteristikou BST je jeho princip uspořádání:

- **Levý podstrom** uzlu obsahuje pouze hodnoty striktně menší než hodnota uzlu.
- **Pravý podstrom** uzlu obsahuje pouze hodnoty striktně větší než hodnota uzlu.
- Duplicitní hodnoty obecně nejsou povoleny.

Tato organizační struktura umožňuje stromu fungovat jako seřazený seznam při zachování hierarchických výhod stromu, což významně zužuje prohledávaný prostor během operací.

## Analýza složitosti

Efektivita binárního vyhledávacího stromu přímo závisí na jeho **výšce**. Ve vyváženém stromu je výška logaritmická vzhledem k počtu uzlů; nicméně v nejhorším případě (například při vkládání seřazených dat) se strom může stát "degenerovanou" linií.

| Operace    | Průměrný případ | Nejhorší případ |
| ---------- | --------------- | --------------- |
| Hledání    | O(log n)        | O(n)            |
| Vložení    | O(log n)        | O(n)            |
| Odstranění | O(log n)        | O(n)            |

## Vyhledávání (Hledání)

Pro nalezení konkrétní hodnoty proces začíná v **kořenovém** uzlu. Algoritmus provádí sérii porovnání pro navigaci stromem:

1. **Porovnání**: Hledaná hodnota je porovnána s hodnotou aktuálního uzlu.
2. **Shoda**: Pokud jsou hodnoty stejné, vyhledávání je úspěšné.
3. **Procházení**:
    - Pokud je hledaná hodnota **menší** než aktuální uzel, vyhledávání pokračuje k **levému potomku**.
    - Pokud je hledaná hodnota **větší** než aktuální uzel, vyhledávání pokračuje k **pravému potomku**.

4. **Ukončení**: Pokud vyhledávání dosáhne prázdné větve (null reference) bez nalezení shody, hodnota ve stromu neexistuje.

## Vložení

Vkládání sleduje cestu podobnou vyhledávání, aby zajistilo umístění nové hodnoty na správné místo pro zachování vlastností stromu.

1. **Kontrola prázdného stromu**: Pokud strom nemá žádné uzly, nová hodnota je umístěna do **kořene**.
2. **Porovnávací smyčka**: Pokud strom není prázdný, algoritmus porovnává novou hodnotu s aktuálním uzlem:
    - **Jít doleva**: Pokud je nová hodnota menší, zkontroluje levého potomka. Pokud je levé místo prázdné, **vytvoří tam nový list**. Jinak prochází hlouběji do levého podstromu.
    - **Jít doprava**: Pokud je nová hodnota větší, zkontroluje pravého potomka. Pokud je pravé místo prázdné, **vytvoří tam nový list**. Jinak prochází hlouběji do pravého podstromu.

3. **Zpracování duplicit**: Pokud hodnota již ve stromu existuje, operace je **zrušena**, protože BST typicky vyžaduje unikátní klíče.

## Odstranění (Smazání)

Odstranění je nejsložitější operace, protože strom musí být restrukturalizován, aby zůstal platný po odstranění uzlu. Proces nejprve zahrnuje vyhledání uzlu a poté analýzu jednoho ze tří případů:

### Fáze 1: Vyhledání a označení

Algoritmus prochází strom pro nalezení cílové hodnoty. Po nalezení je uzel **označen k odstranění**.

### Fáze 2: Analýza případů

V závislosti na počtu potomků označeného uzlu je použita jedna z následujících strategií:

- **Případ 1: Listový uzel (žádní potomci)**
  Uzel je jednoduše odstraněn ze stromu a reference rodiče na něj je vymazána.
- **Případ 2: Jeden potomek**
  Uzel je odstraněn a jeho jediný potomek je povýšen na jeho místo. Rodič odstraněného uzlu je **přepojen** přímo k tomuto potomku.
- **Případ 3: Dva potomci**
  Pro zachování pořadí BST nelze uzel jednoduše odstranit. Místo toho algoritmus najde **následníka v inorder pořadí** (nejmenší hodnotu v pravém podstromu).
    1. **Identifikace následníka**: Přejděte na pravého potomka, poté se pohybujte doleva jak nejdále to jde.
    2. **Přepojení potomka následníka**: Pokud má následník pravého potomka, tento potomek je přepojen k rodiči následníka, aby se neztratila žádná data.
    3. **Nahrazení**: Hodnota a identita uzlu označeného k odstranění jsou nahrazeny hodnotou a identitou následníka, čímž efektivně "prohodíme" následníka na cílovou pozici.
