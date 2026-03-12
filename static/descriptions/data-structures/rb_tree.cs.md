# Červeno-černý strom

**Červeno-černý strom** je sofistikovaný typ samovyvažujícího se binárního vyhledávacího stromu. Zajišťuje, že strom zůstává přibližně vyvážený, zabraňuje tomu, aby se stal "plochým" seznamem, a udržuje efektivní výkon pro všechny operace.

Na rozdíl od standardního stromu každý uzel v červeno-černém stromu nese další bit informace: svou **barvu** (buď **červená** nebo **černá**). Tyto barvy se používají k vynucení specifické sady pravidel během vkládání a mazání, aby byla zaručena rovnováha stromu.

### Pět vlastností

Aby byla struktura považována za platný červeno-černý strom, musí vždy splňovat těchto pět podmínek:

1. **Barva**: Každý uzel je buď červený, nebo černý.
2. **Kořen**: Kořen stromu je vždy černý.
3. **List**: Každý list (null) je považován za černý.
4. **Červené pravidlo**: Pokud je uzel červený, oba jeho potomci musí být černí (žádné dva červené uzly nemohou být vedle sebe).
5. **Pravidlo cesty**: Pro každý uzel musí všechny jednoduché cesty od tohoto uzlu k listovým potomkům obsahovat stejný počet černých uzlů.

### Nástroje pro vyvážení

Pro udržení těchto vlastností během vkládání a mazání červeno-černé stromy používají dvě primární operace:

- **Přebarvení**: Změna uzlů mezi červenou a černou pro splnění pravidla cesty a červeného pravidla.
- **Levé/pravé rotace**: Vertikální pohyb uzlů pro změnu struktury stromu bez porušení pořadí binárního vyhledávání.

## Analýza složitosti

Červeno-černý strom poskytuje vynikající záruky výkonu. Zajištěním, že nejdelší cesta od kořene k listu není více než dvakrát delší než nejkratší cesta, udržuje operace logaritmické.

| Operace    | Nejhorší případ |
| ---------- | --------------- |
| Hledání    | O(log n)        |
| Vložení    | O(log n)        |
| Odstranění | O(log n)        |

## Vyhledávání (Hledání)

Proces vyhledávání je totožný se standardním binárním vyhledávacím stromem.

1. **Porovnání**: Algoritmus začíná v kořeni a porovnává hledanou hodnotu s hodnotou aktuálního uzlu.
2. **Procházení**:
    - Pokud je hledaná hodnota **menší**, přesune se k **levému potomku**.
    - Pokud je hledaná hodnota **větší**, přesune se k **pravému potomku**.

3. **Výsledek**: Pokud je nalezena shoda, uzel je vrácen. Pokud vyhledávání dosáhne null listu, hodnota není ve stromu.

## Vložení

Vkládání do červeno-černého stromu zahrnuje umístění nových dat a následné provedení "opravy" pro obnovení případných porušených vlastností.

### Fáze 1: Umístění

- Strom je procházen jako standardní BST pro nalezení správného prázdného místa.
- Na tomto místě je vytvořen **nový červený uzel**.
- Pokud byl strom prázdný, tento uzel se stává kořenem a je obarven **černě** pro splnění vlastnosti kořene.

### Fáze 2: Obnovení vlastností (oprava)

Pokud je rodič nového uzlu také červený, "červené pravidlo" je porušeno. Algoritmus se podívá na **strýce** (sourozence rodiče) a rozhodne, jak to opravit:

- **Případ 1: Červený strýc**: Pokud je strýc červený, algoritmus **přebarví** rodiče a strýce na černou a prarodiče na červenou. Kontrola se pak přesune nahoru k prarodiči.
- **Případ 2: Černý strýc (trojúhelník)**: Pokud je strýc černý a nový uzel tvoří "trojúhelníkový" tvar s rodičem a prarodičem, provede se **rotace** na rodiči, aby se změnil na "linii".
- **Případ 3: Černý strýc (linie)**: Pokud je strýc černý a uzly tvoří přímou linii, algoritmus **přebarví** rodiče na černou a prarodiče na červenou, pak provede **rotaci** na prarodiči pro vyvážení stromu.

## Odstranění (Smazání)

Odstranění je nejsložitější operace, protože odstranění černého uzlu může narušit "pravidlo cesty" (černá výška stromu).

### Fáze 1: Vyhledání a standardní odstranění

1. **Lokalizace**: Cílový uzel je nalezen pomocí logiky vyhledávání.
2. **Označení**: Uzel je označen k odstranění.
3. **Fyzické odstranění**:
    - **List nebo jeden potomek**: Uzel je odstraněn a jeho potomek (pokud existuje) je "transplantován" na jeho pozici.
    - **Dva potomci**: Je nalezen **následník v inorder pořadí** (nejmenší uzel v pravém podstromu). Jeho hodnota je zkopírována do cílového uzlu a místo něj je odstraněn původní uzel následníka.

### Fáze 2: Obnovení vlastností (oprava)

Pokud byl odstraněný uzel **černý**, vytvoří to porušení "dvojitě černá", což znamená, že jedna cesta má nyní méně černých uzlů než ostatní. Algoritmus to opravuje zkoumáním **sourozence** aktuálního uzlu:

- **Případ 0: Null list**: Pokud dojde k porušení na konceptuálně prázdném listu, algoritmus se připraví na opravu rovnováhy začínající od rodiče.
- **Případ 1: Červený sourozenec**: Sourozenec je přebarven na černou a rodič na červenou, následuje **rotace** u rodiče pro přinesení černého uzlu do cesty.
- **Případ 2: Černý sourozenec se dvěma černými potomky**: Sourozenec je přebarven na **červenou** a status "dvojitě černá" se přesune nahoru k rodiči, kde bude vyřešen.
- **Případ 3: Černý sourozenec s blízkým červeným potomkem**: Sourozenec a jeho červený potomek jsou **přebarveni a rotováni** pro transformaci na případ 4.
- **Případ 4: Černý sourozenec se vzdáleným červeným potomkem**: Sourozenec přebírá barvu rodiče, rodič a vzdálený potomek jsou obarveni **černě** a **rotace** je provedena u rodiče pro dokonalé obnovení černé výšky.
