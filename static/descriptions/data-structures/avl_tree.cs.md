# AVL strom

AVL strom je vysoce strukturovaný, samovyvažující se binární vyhledávací strom. Je pojmenován po svých vynálezcích (Adelson-Velskij a Landis) a řeší hlavní nedostatek standardního binárního stromu tím, že zajišťuje, aby struktura nikdy nedegradovala do rovné linie. Toho je dosaženo neustálým monitorováním vlastního tvaru a automatickou reorganizací, kdykoli se struktura stane příliš nevyváženou.

Ve vizuální reprezentaci grafu se napravo od každého uzlu nachází žlutý obdélník. Ten zobrazuje dvě důležité informace: **H** pro výšku (Height) uzlu a **B** pro jeho faktor vyvážení (Balance factor).

### Klíčové koncepty

Pochopení toho, jak si tento strom udržuje svůj tvar, vyžaduje seznámení se s metrikami používanými k jeho měření a strukturálními kroky používanými k jeho opravě.

- **Výška (H):** Jedná se o délku nejdelší cesty z daného uzlu dolů k listu. Listový uzel má vždy výšku 1.
- **Faktor vyvážení (B):** Vypočítá se tak, že se od výšky levého potomka uzlu odečte výška jeho pravého potomka.
- **Rotace:** Když strom detekuje nevyváženost, použije k její nápravě strukturální posuny zvané rotace.
    - **Pravá rotace:** Používá se k opravě nevyváženosti s převahou vlevo. Vytáhne levého potomka nahoru a zatlačí aktuální kořen dolů doprava.
    - **Levá rotace:** Používá se k opravě nevyváženosti s převahou vpravo. Vytáhne pravého potomka nahoru a zatlačí aktuální kořen dolů doleva.
    - **Levá-pravá rotace:** Dvoukroková oprava. Nejprve levá rotace na levém potomkovi, následovaná pravou rotací na rodiči.
    - **Pravá-levá rotace:** Dvoukroková oprava. Nejprve pravá rotace na pravém potomkovi, následovaná levou rotací na rodiči.

### Pravidla

- **Vlastnosti BVS:** Platí všechna standardní pravidla binárního vyhledávacího stromu. Leví potomci musí být ostře menší a praví potomci ostře větší. Duplicitní hodnoty se zahazují.
- **Vlastnost AVL:** Pro každý jednotlivý uzel ve stromu musí být faktor vyvážení vždy `-1`, `0` nebo `1`. Pokud jakákoli operace způsobí, že vyvážení uzlu dosáhne hodnoty `2` nebo `-2`, je strom oficiálně nevyvážený a musí se okamžitě provést rotace k jeho nápravě.

### Analýza složitosti

Protože AVL strom striktně vynucuje svá pravidla vyvažování, je matematicky zaručeno, že výška stromu zůstane na `O(log n)`. To znamená, že nejhorší možný scénář standardního binárního stromu zde jednoduše nemůže nastat, což vede k vysoce konzistentnímu výkonu.

| Operace      | Nejhorší případ |
| :----------- | :-------------- |
| **Vložení**  | `O(log n)`      |
| **Nalezení** | `O(log n)`      |
| **Odebrání** | `O(log n)`      |

## Vložení

Vkládání začíná identicky jako u standardního stromu, ale při cestě zpět nahoru přidává fázi striktního opětovného vyvažování.

1.  **Vložení podle BVS**: Projde se strom a nový listový uzel se vloží přesně jako ve standardním binárním vyhledávacím stromu. Uchovává se záznam o cestě od kořene k tomuto novému uzlu.
2.  **Aktualizace a kontrola**: Postupuje se zpět po cestě od nového uzlu ke kořeni. V každém kroku se aktualizuje výška (H) uzlu a přepočítá se jeho faktor vyvážení (B).
3.  **Opětovné vyvážení**: Pokud se narazí na uzel s faktorem vyvážení `2` nebo `-2`, analyzuje se tvar nevyváženosti, aby se aplikovala správná rotace. Typ nevyváženosti se určí pohledem na převažující podstrom a jeho potomka:
    - **Nevyváženost levá-levá:** Uzel má převahu vlevo (B = `2`) a jeho levý potomek má také převahu vlevo nebo je vyvážený. Opravuje se pravou rotací.
    - **Nevyváženost pravá-pravá:** Uzel má převahu vpravo (B = `-2`) a jeho pravý potomek má také převahu vpravo nebo je vyvážený. Opravuje se levou rotací.
    - **Nevyváženost levá-pravá:** Uzel má převahu vlevo (B = `2`), ale jeho levý potomek má převahu vpravo. Opravuje se levou-pravou rotací.
    - **Nevyváženost pravá-levá:** Uzel má převahu vpravo (B = `-2`), ale jeho pravý potomek má převahu vlevo. Opravuje se pravou-levou rotací.

## Nalezení

Prohledávání stromu používá stejnou logiku průchodu jako standardní binární vyhledávací strom. Vzhledem k tomu, že nalezení hodnoty nemění strukturu, není nutné kontrolovat žádné výšky ani faktory vyvážení.

## Odebrání

Odstranění je na zdroje nejnáročnější operací, protože smazání uzlu může způsobit kaskádový efekt nevyvážeností až ke kořeni.

1.  **Smazání podle BVS**: Najde se cílový uzel a odstraní se pomocí standardních pravidel BVS (zpracování případů s listem, jedním potomkem nebo dvěma potomky). Sleduje se cesta zpět ke kořeni, počínaje rodičem odstraněného nebo přesunutého uzlu.
2.  **Aktualizace a kontrola**: Sledují se kroky zpět nahoru stromem, přičemž se aktualizuje výška a faktor vyvážení pro každý uzel na cestě.
3.  **Opětovné vyvážení**: Stejně jako při vkládání se aplikují rotace, pokud se faktor vyvážení jakéhokoli uzlu stane neplatným. Specifický typ nevyváženosti (levá-levá, pravá-pravá, levá-pravá nebo pravá-levá) se určuje pomocí stejné logiky. Na rozdíl od vkládání (které se opraví jedinou sekvencí rotací) však smazání uzlu zmenší podstrom a může vyvolat další nevyváženosti výše. To znamená, že rotace mohou kaskádovitě proběhnout i několikrát, než se dosáhne kořene.

## Poznámky

AVL strom je vynikající volbou pro aplikace s převahou čtení, kde jsou nezbytné rychlé časy vyhledávání. Protože je tak striktně vyvážený, extrémně rychlé vyhledávání je matematicky zaručeno.

**Kdy toto NEPOUŽÍVAT:** AVL stromům je vhodné se vyhnout, pokud má aplikace převahu zápisu, což znamená, že vyžaduje masivní objem neustálých vkládání a mazání. Striktní pravidla vyvažování znamenají, že strom musí vynaložit velké výpočetní úsilí na neustálé rotace a aktualizace výšek. V těchto scénářích je často upřednostňována o něco volnější samovyvažující se struktura, jako je červeno-černý strom, protože k vlastnímu udržování vyžaduje méně rotací.
