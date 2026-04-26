# Bubble Sort

Bubble Sort je přímočarý třídicí algoritmus založený na porovnávání. Pracuje opakovaným procházením sekvence, přičemž porovnává sousední prvky a prohazuje je, pokud jsou v nesprávném pořadí. Tento proces se opakuje, dokud není celý seznam plně roztříděn. Algoritmus odvozuje svůj název ze způsobu, jakým větší prvky konceptuálně „probublávají“ na konec seznamu při každém dalším průchodu.

### Vlastnosti

- **Paměť:** In-place. Vyžaduje pouze konstantní množství dodatečné paměti pro dočasnou proměnnou použitou během prohazování.
- **Stabilita:** Stabilní. Pokud mají dva prvky stejnou hodnotu, jejich relativní pořadí zůstává striktně zachováno, protože algoritmus provádí prohození pouze v případě, kdy je prvek ostře větší než jeho soused.
- **Paradigma:** Hrubá síla (Brute Force) / Inkrementální.

### Analýza složitosti

Nejhorší scénář nastává v situaci, kdy je pole seřazeno v opačném pořadí. V tomto stavu musí být každý prvek porovnán a prohozen přes celou délku pole, čímž se maximalizuje počet operací. Nejlepšího případu `O(n)` lze dosáhnout pouze se specifickým optimalizačním příznakem. Bez něj algoritmus provádí `O(n^2)` porovnání bez ohledu na počáteční uspořádání.

| Nejlepší případ | Průměrný případ | Nejhorší případ | Paměť  |
| :-------------- | :-------------- | :-------------- | :----- |
| `O(n)`          | `O(n^2)`        | `O(n^2)`        | `O(1)` |

## Algoritmus

Algoritmus spoléhá na dvě vnořené smyčky k systematickému posouvání nejvyšších netříděných hodnot na konec pole.

1. **Vnější smyčka**: Sleduje počet průchodů polem. Po každém úplném průchodu vnitřní smyčky je největší zbývající prvek zaručeně na své správné finální pozici.
2. **Vnitřní smyčka**: Prochází netříděnou část pole. S každým dalším průchodem vnější smyčky se tato vnitřní cesta zkracuje o jeden prvek.
3. **Porovnání**: V každém kroku vnitřní smyčky se porovnává aktuálně vybraný prvek s jeho bezprostředním pravým sousedem.
4. **Prohození**: Rozhodne se o akci na základě porovnání:
    - Pokud je aktuální prvek ostře větší než jeho soused, tyto dvě hodnoty se prohodí.
    - Pokud je aktuální prvek menší nebo stejný, zůstávají na svých aktuálních pozicích.
    - Proces se poté posune o jednu pozici doprava a opakuje logiku porovnání a prohození, dokud není celá netříděná část pole projita.

## Poznámky

Bubble Sort se primárně používá jako vzdělávací nástroj k představení konceptů algoritmického třídění a časové složitosti.

**Kdy toto nepoužívat:** Bubble Sort by se v podstatě nikdy neměl používat v produkčním prostředí pro velké datové sady. Jeho kvadratická časová složitost způsobuje drastickou neefektivitu ve srovnání s pokročilými algoritmy jako Quick Sort nebo Merge Sort.

### Optimalizace

Standardní implementace Bubble Sort naivně dokončí každý průchod i v případě, kdy se pole stane plně roztříděným v polovině procesu.

Běžnou optimalizací je zavedení boolean příznaku `swapped`. Na začátku každé vnější iterace se tento příznak nastaví na `false`. Pokud během vnitřní iterace dojde k jakémukoli prohození, příznak se změní na `true`. Pokud celá vnější iterace proběhne bez jediného prohození, matematicky to dokazuje plné setřídění pole. Algoritmus pak může bezpečně ukončit smyčku dříve, čímž v nejlepším případě dosahuje časové složitosti `O(n)` u již roztříděných seznamů.
