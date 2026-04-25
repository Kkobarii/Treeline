# Binární vyhledávací strom

Binární vyhledávací strom (BVS, anglicky BST) je hierarchická datová struktura založená na uzlech, která udržuje data seřazená tak, jak jsou vkládána. Každý uzel obsahuje hodnotu a ukazatele na maximálně dva potomky: levého potomka a pravého potomka. Definující charakteristikou BVS je jeho striktní uspořádání, které umožňuje rychlé vyhledávání, vkládání a mazání dat tím, že v každém kroku zmenší prohledávaná data na polovinu, podobně jako binární vyhledávání v seřazeném poli.

### Pravidla

- **Vlastnost levého podstromu:** Všechny uzly v levém podstromu musí mít hodnoty ostře menší, než je hodnota rodičovského uzlu.
- **Vlastnost pravého podstromu:** Všechny uzly v pravém podstromu musí mít hodnoty ostře větší, než je hodnota rodičovského uzlu.
- **Žádné duplicity:** V této konkrétní implementaci nejsou povoleny duplicitní hodnoty.

### Analýza složitosti

Efektivita binárního vyhledávacího stromu je zcela závislá na jeho výšce, označované jako `h`. V optimálním, dokonale vyváženém stromu je výška `log2(n)`, což vede k velmi rychlým logaritmickým operacím. Pokud jsou však data vkládána v seřazeném nebo téměř seřazeném pořadí (jako 1, 2, 3, 4, 5), strom degraduje do rovné linie a v podstatě se stává spojovým seznamem. V tomto nejhorším případě se výška stává `n` a výkon výrazně klesá.

| Operace      | Průměrný případ | Nejhorší případ |
| :----------- | :-------------- | :-------------- |
| **Vložení**  | `O(log n)`      | `O(n)`          |
| **Nalezení** | `O(log n)`      | `O(n)`          |
| **Odebrání** | `O(log n)`      | `O(n)`          |

## Vložení

Proces vkládání prochází stromem dolů, aby našel správné prázdné místo pro novou hodnotu a zajistil, že budou zachována pravidla BVS.

1. **Kontrola kořene:** Pokud je strom zcela prázdný, nová hodnota se okamžitě stává kořenovým uzlem.
2. **Porovnání:** Porovná se nová hodnota s hodnotou aktuálního uzlu.
3. **Průchod:** Rozhodne se o cestě na základě porovnání:
    - Pokud je nová hodnota menší než aktuální uzel, postupuje se doleva. Pokud neexistuje žádný levý potomek, vytvoří se zde nový listový uzel. V opačném případě se přejde na levého potomka a opakuje se krok 2.
    - Pokud je nová hodnota větší než aktuální uzel, postupuje se doprava. Pokud neexistuje žádný pravý potomek, vytvoří se zde nový listový uzel. V opačném případě se přejde na pravého potomka a opakuje se krok 2.
4. **Zahození duplicity:** Pokud se nová hodnota rovná hodnotě aktuálního uzlu, operace se zastaví a hodnota se zahodí, protože duplicity jsou odmítány.

## Nalezení

Prohledávání stromu používá naprosto stejnou logiku průchodu jako vkládání.

1. **Porovnání:** Začíná se v kořeni a porovná se hledaná hodnota s aktuálním uzlem.
2. **Nalezeno:** Pokud se hodnoty shodují, uzel byl úspěšně nalezen.
3. **Průchod:** Rozhodne se o cestě na základě porovnání:
    - Pokud je hledaná hodnota menší, přejde se na levého potomka.
    - Pokud je hledaná hodnota větší, přejde se na pravého potomka.
4. **Nenalezeno:** Při pokusu o přechod na potomka, který neexistuje (ukazatel na `null`), je hledání ukončeno, což znamená, že hodnota se ve stromu nenachází.

## Odebrání

Odstranění uzlu je nejsložitější operací v BVS, protože strom se musí sám znovu propojit, aniž by porušil pravidla uspořádání. Strom nejprve vyhledá cílovou hodnotu a po cestě si pamatuje rodičovský uzel. Jakmile je uzel nalezen a označen ke smazání, strom analyzuje potomky uzlu, aby určil strategii odstranění.

### Případ 1: Listový uzel

Toto je nejjednodušší případ. Pokud uzel, který má být smazán, nemá žádné potomky, je jednoduše odstraněn nastavením ukazatele jeho rodiče na `null`.

### Případ 2: Jeden potomek

Pokud má uzel pouze jednoho potomka (buď levého, nebo pravého), uzel se zcela obejde. Strom nahradí smazaný uzel tím, že propojí jeho rodiče přímo s tímto jediným potomkem.

### Případ 3: Dva potomci

Pokud má uzel levého i pravého potomka, nelze ho jednoduše smazat bez toho, aby jeho potomci zůstali odpojeni.

1. **Nalezení in-order následníka:** Strom najde uzel s nejbližší vyšší hodnotou. To se provede tak, že se jednou přejde na pravého potomka a poté se prochází co nejdále doleva.
2. **Přepojení potomka následníka:** Pokud má následník vlastního pravého potomka, tento potomek je přepojen k rodiči následníka.
3. **Nahrazení:** Hodnota původního cílového uzlu je nahrazena daty následníka. Strukturální pozice původního uzlu zůstává nedotčena, ale data jsou přepsána, čímž se efektivně smaže cílová hodnota a zachová se platný BVS.

## Poznámky

Ačkoli je binární vyhledávací strom skvělou úvodní strukturou, jeho fatální chybou je absence samovyvažování.

**Kdy toto NEPOUŽÍVAT:** Standardním BVS je vhodné se vyhnout, pokud by vstupní data mohla být předem seřazená, protože složitost `O(n)` v nejhorším případě jej činí nepřijatelně pomalým pro velké datové sady.

V reálném světě se standardní BVS v produkčním kódu používají zřídka. Místo toho slouží jako základní logika pro **samovyvažující se stromy** (jako jsou AVL stromy a červeno-černé stromy). Tyto pokročilé struktury využívají stejnou logiku vkládání a mazání, ale na konci operací přidávají složité rotace, aby zaručily, že strom zůstane krátký a široký, čímž si udrží optimální logaritmickou časovou složitost.
