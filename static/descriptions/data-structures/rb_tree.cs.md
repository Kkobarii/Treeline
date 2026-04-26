# Červeno-černý strom

Červeno-černý strom je samovyvažující se binární vyhledávací strom. Zatímco AVL stromy udržují striktní vyvážení kontrolou výšky podstromů, červeno-černé stromy udržují volnější vyvážení přiřazením barvy (červené nebo černé) každému uzlu a vynucením specifické sady pravidel týkajících se toho, jak mohou být tyto barvy uspořádány. Tento přístup zaručuje, že žádná cesta od kořene k listu není více než dvakrát delší než jakákoli jiná cesta, což zajišťuje, že strom zůstane přibližně vyvážený.

### Klíčové koncepty

- **Barvy:** Červené a černé označení je primárním mechanismem pro sledování vyvážení. Striktní pravidla upravující jejich umístění zabraňují tomu, aby se strom stal příliš nevyváženým.
- **Rotace:** Stejně jako AVL stromy, i červeno-černé stromy používají levé rotace a pravé rotace k opravě strukturálních nevyvážeností. Rotace mění fyzické uspořádání uzlů.
- **Přebarvení:** Předtím, než se přistoupí k rotacím, strom se často pokusí opravit porušení pravidla jednoduše změnou barev zúčastněných uzlů, jako je například přepnutí červeného uzlu na černý nebo naopak.

### Pravidla

Pro zachování své vyvážené struktury červeno-černý strom striktně vynucuje pět základních vlastností:

- **Vlastnost barvy:** Každý uzel je obarven buď červeně, nebo černě.
- **Vlastnost kořene:** Kořen stromu je vždy černý.
- **Vlastnost listu:** Všechny listy (myšleno konceptuální nulové uzly na konci větví) jsou černé.
- **Červené pravidlo:** Pokud je uzel červený, oba jeho potomci musí být černí. To znamená, že na žádné cestě nemohou být dva po sobě jdoucí červené uzly.
- **Černé pravidlo:** Každá jednoduchá cesta od daného uzlu k jakémukoli z jeho potomků (listů) musí obsahovat přesně stejný počet černých uzlů.

### Analýza složitosti

Protože červeno-černý strom zaručuje, že nejdelší cesta není nikdy více než dvakrát delší než nejkratší cesta, je dáno, že jeho výška zůstane na `O(log n)`. Ačkoli může být o něco vyšší než striktně vyvážený AVL strom, jeho operace zůstávají logaritmicky rychlé.

| Operace      | Nejhorší případ |
| :----------- | :-------------- |
| **Vložení**  | `O(log n)`      |
| **Nalezení** | `O(log n)`      |
| **Odebrání** | `O(log n)`      |

## Vložení

Vkládání je rozděleno do dvou fází: umístění uzlu a následná oprava jakýchkoli pravidel, která nový uzel mohl porušit.

### Fáze 1: Vložení podle BVS

1.  **Vložení:** Nový uzel je vložen do stromu pomocí standardní logiky průchodu binárním vyhledávacím stromem.
2.  **Obarvení na červeno:** Každý nově vložený uzel je zpočátku obarven červeně. Dělá se to proto, že přidání červeného uzlu nezmění černou výšku (černé pravidlo), což je nejobtížněji opravitelné pravidlo. Přidání červeného uzlu však může porušit červené pravidlo, pokud je rodič nového uzlu také červený.

### Fáze 2: Oprava

Pokud je rodič nového červeného uzlu také červený, došlo k porušení pravidla dvou červených uzlů (dvojitá červená). Strom analyzuje strýce nového uzlu (sourozence jeho rodiče), aby se určilo, jak toto porušení opravit.

1.  **Případ 1 (Strýc je červený):** Pokud je strýc červený, provede se jednoduché přebarvení. Rodič a strýc se obarví černě a prarodič se obarví červeně. Pozornost se poté přesune nahoru k prarodiči, aby se zajistilo, že jeho obarvení na červeno nezpůsobilo nové porušení výše ve stromu.
2.  **Případ 2 (Strýc je černý, tvar trojúhelníku):** Pokud nový uzel, jeho rodič a jeho prarodič tvoří trojúhelník (například rodič je levý potomek a nový uzel je pravý potomek), provede se rotace na rodiči, aby se uzly zarovnaly do přímky. Tím strom přejde do případu 3.
3.  **Případ 3 (Strýc je černý, tvar přímky):** Pokud uzly tvoří přímku, rodič se obarví černě, prarodič červeně a provede se rotace na prarodiči. Tím se porušení opraví.
4.  **Vynucení pravidla kořene:** Po dokončení všech oprav je kořen vždy přebarven na černý, pro případ, že by byl během procesu obarven červeně.

## Nalezení

Prohledávání stromu používá naprosto stejnou logiku průchodu jako standardní binární vyhledávací strom. Barvy se během vyhledávání zcela ignorují.

## Odebrání

Odstranění je nejsložitější operací, protože smazání uzlu může narušit striktní barevné vlastnosti, zejména černou výšku.

### Fáze 1: Smazání podle BVS

1.  **Smazání:** Najde se cílový uzel a odstraní se nebo se nahradí pomocí standardních pravidel BVS (zpracování případů s listem, jedním potomkem nebo dvěma potomky).
2.  **Sledování barvy:** Pokud byl smazaný (nebo přesunutý) uzel červený, nebyla porušena žádná pravidla, protože červené uzly neovlivňují černou výšku a odstranění jednoho z nich nemůže vytvořit dvojitou červenou. Pokud však byl odstraněný uzel černý, bylo porušeno černé pravidlo, protože jedna cesta má nyní méně černých uzlů než ostatní.

### Fáze 2: Oprava

Pokud byl odstraněn černý uzel, strom musí projít procesem opravy, aby se obnovila černá výška. Analyzuje se sourozenec uzlu, který nahradil smazaný uzel.

1.  **Případ 1 (Sourozenec je červený):** Sourozenec se obarví černě, rodič se obarví červeně a na rodiči se provede rotace. To neopraví černou výšku, ale změní to strukturu tak, že nový sourozenec je zaručeně černý, což umožňuje přechod k jednomu z dalších případů.
2.  **Případ 2 (Sourozenec je černý, oba potomci jsou černí):** Sourozenec se obarví červeně a pozornost se přesune nahoru k rodiči.
3.  **Případ 3 (Sourozenec je černý, bližší potomek je červený):** Bližší potomek se obarví černě, sourozenec se obarví červeně a na sourozenci se provede rotace. Tím strom přejde do případu 4.
4.  **Případ 4 (Sourozenec je černý, vzdálenější potomek je červený):** Sourozenec převezme barvu rodiče, rodič se obarví černě, vzdálenější potomek se obarví černě a na rodiči se provede rotace. Tím se úspěšně obnoví černá výška.
5.  **Porušení dvojité černé:** Ve specifických scénářích musí konceptuální nulový uzel dočasně nést extra černou váhu, aby se udrželo vyvážení, což spouští specifickou opravu k vyřešení tohoto porušení dvojité černé.

## Poznámky

Červeno-černé stromy jsou vysoce praktické a jsou velmi běžné v reálných systémech, často se používají k implementaci asociativních polí a množin ve standardních programovacích knihovnách.

**Zajímavost:** Červeno-černý strom je ve skutečnosti chytrou binární reprezentací 2-3-4 stromu, což je samo o sobě specifický typ B-stromu, kde uzly mohou pojmout až tři hodnoty a mít až čtyři potomky. Červené odkazy se zde používají ke konceptuálnímu spojení standardních binárních uzlů za účelem simulace těchto větších vícehodnotových uzlů.

**Kdy toto nepoužívat:** Ačkoli jsou červeno-černé stromy vynikajícími strukturami pro obecné použití, pokud má aplikace extrémní převahu čtení a vyžaduje absolutně nejrychlejší možná vyhledávání, striktnější vyvažování AVL stromu by mohlo poskytnout o něco lepší výkon vyhledávání.
