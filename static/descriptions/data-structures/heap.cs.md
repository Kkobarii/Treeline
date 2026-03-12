# Binární halda

**Binární halda** je specializovaná stromová datová struktura, která se primárně používá k implementaci prioritních front. Je to **úplný binární strom**, což znamená, že každá úroveň stromu je plně zaplněna, s výjimkou poslední úrovně, která je zaplňována zleva doprava.

Nejdůležitější vlastností haldy je **vlastnost haldy**:

- **Min-halda**: Hodnota každého uzlu je větší nebo rovna hodnotě jeho rodiče. V důsledku toho je nejmenší hodnota vždy v kořeni.
- **Max-halda**: Hodnota každého uzlu je menší nebo rovna hodnotě jeho rodiče. V důsledku toho je největší hodnota vždy v kořeni.

Simulace vizualizuje max-haldu, ale principy se podobně aplikují na min-haldy s obráceným porovnáváním.

## Analýza složitosti

Protože halda je vždy úplný strom, její výška je zaručeně logaritmická. To zajišťuje, že prvky mohou být rychle přeuspořádány po jakékoli změně.

| Operace                | Časová složitost |
| ---------------------- | ---------------- |
| **Nahlédnutí (kořen)** | O(1)             |
| **Vložení**            | O(log n)         |
| **Extrakce kořene**    | O(log n)         |

## Vložení

Pro přidání nové hodnoty při zachování "úplnosti" stromu algoritmus sleduje specifickou cestu zdola nahoru.

1. **Počáteční umístění**: Nová hodnota je umístěna na první dostupné místo ve spodní části stromu (nejlevější prázdná pozice na poslední úrovni). Tím se zachovává strukturální integrita úplného stromu.
2. **Porovnání a probublání nahoru**:
    - Algoritmus porovnává novou hodnotu s jejím **rodičem**.
    - **Výměna**: Pokud je vlastnost haldy porušena (např. v max-haldě, pokud je nová hodnota větší než její rodič), oba uzly jsou prohozeny.

3. **Procházení cesty**: Tento proces se opakuje, přesouvá uzel nahoru stromem, dokud buď nedosáhne **kořene**, nebo nenajde rodiče, který splňuje vlastnost haldy.

## Extrakce kořene

Extrakce kořene je proces odstranění prvku s nejvyšší prioritou. Protože nemůžeme nechat kořen prázdný, strom musí být restrukturalizován.

1. **Identifikace nástupce**: Hodnota v kořeni je odstraněna. Pro zachování úplnosti stromu je **poslední uzel** (nejpravější uzel na spodní úrovni) přesunut na pozici kořene.
2. **Porovnání a probublání dolů**:
    - Algoritmus porovnává novou hodnotu kořene s jeho **potomky**.
    - **Identifikace prioritního potomka**: V max-haldě algoritmus hledá většího ze dvou potomků. V min-haldě hledá menšího.

3. **Výměna**: Pokud má potomek vyšší prioritu než aktuální uzel, jsou prohozeni.
4. **Procházení cesty**: Uzel pokračuje v "probublávání dolů" stromem, prohodí se s jeho prioritním potomkem na každé úrovni, dokud není správně umístěn (tj. je větší než jeho potomci nebo dosáhl spodku).
