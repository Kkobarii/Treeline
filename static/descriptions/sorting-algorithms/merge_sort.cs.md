# Merge Sort

Merge Sort je efektivní stabilní řadicí algoritmus založený na porovnávání, který využívá strategii rozděl a panuj. Funguje tak, že se pole koncepčně rozdělí na několik podpolí, dokud se každé podpole neskládá z jediného prvku, a následně se tato podpole sloučí způsobem, jehož výsledkem je nové setříděné podpole. Tento proces pokračuje rekurzivně, dokud není celé pole zrekonstruováno v setříděném pořadí.

### Vlastnosti

- **Paměťová složitost:** Out-of-place. Na rozdíl od algoritmu Quick Sort vyžaduje standardní Merge Sort `O(n)` dodatečné paměti pro uložení dočasných podpolí během procesu slučování.
- **Stabilita:** Stabilní. Zachovává relativní pořadí stejných prvků, protože během fáze slučování, když jsou dva prvky stejné, se vždy vybere jako první prvek z „levého“ podpole.
- **Paradigma:** Rozděl a panuj.

### Analýza složitosti

Merge Sort je vysoce předvídatelný. Protože se pole vždy rozdělí na dvě stejné poloviny a během fáze slučování se zpracuje každý prvek, výkon nekolísá na základě počátečního pořadí dat. Ať už je pole již setříděné, reverzně setříděné nebo zcela náhodné, provede se vždy stejný počet operací.

| Nejlepší případ | Průměrný případ | Nejhorší případ | Paměť  |
| :-------------- | :-------------- | :-------------- | :----- |
| `O(n log n)`    | `O(n log n)`    | `O(n log n)`    | `O(n)` |

## Algoritmus

Algoritmus je rozdělen na rekurzivní dělení pole a následné slučování fragmentů.

### Fáze rozdělování

1. **Rozdělení**: Najde se středový bod aktuálního segmentu pole.
2. **Volání vlevo**: Funkce se rekurzivně zavolá pro levou polovinu (od začátku do středu).
3. **Volání vpravo**: Funkce se rekurzivně zavolá pro pravou polovinu (od středu plus jedna do konce).
4. **Základní případ**: Rozdělování se zastaví, když segment obsahuje pouze jeden prvek, protože jediný prvek je již z definice setříděný.

### Fáze slučování

Jakmile jsou podpole rozdělena, sloučí se zpět dohromady v setříděném pořadí.

1. **Porovnání**: Zkontroluje se první dostupný prvek v levém podpoli a první dostupný prvek v pravém podpoli.
2. **Výběr menšího**: Vybere se menší z obou hodnot a přesune se do výsledného sloučeného pole.
    - Pokud jsou hodnoty stejné, vezme se prvek z levého podpole, aby se zachovala stabilita.
3. **Posun a opakování**: Ukazatel podpole, které poskytlo hodnotu, se posune o jednu pozici doprava. Porovnávání se opakuje, dokud není jedno z podpolí vyčerpáno.
4. **Připojení zbývajících**: Případné prvky zbývající v nevyčerpaném podpoli (buď levém, nebo pravém) se připojí na konec sloučeného pole v jejich stávajícím pořadí.

## Poznámky

Merge Sort je preferovaným algoritmem, když je požadavkem stabilita nebo při práci se spojovými seznamy, kde může být implementován efektivněji než Quick Sort. Je základem pro **Timsort**, výchozí třídicí algoritmus v jazycích Python, Java a v systému Android.

**Kdy toto nepoužívat:** Algoritmu Merge Sort je třeba se vyhnout v prostředích s omezenou pamětí, jako jsou vestavěné systémy, protože paměťový požadavek `O(n)` může být poměrně nákladný ve srovnání s algoritmy pracujícími na místě (in-place), jako jsou Quick Sort nebo Heap Sort.

### Optimalizace

- **Hybrid s Insertion Sort**: Pro velmi malá podpole (typicky kolem 7 až 15 prvků) se režie rekurzivních volání stává neefektivní. Mnoho implementací u těchto malých segmentů přechází na Insertion Sort, aby se proces urychlil.
- **Kontrola setříděnosti**: Před vstupem do fáze slučování lze zkontrolovat, zda je poslední prvek levého podpole menší nebo roven prvnímu prvku pravého podpole. Pokud ano, obě poloviny jsou vůči sobě již setříděné a krok slučování lze zcela přeskočit.
- **In-place Merge Sort**: Existují varianty algoritmu Merge Sort, které se pokoušejí řadit s pamětí `O(1)`, ale jsou podstatně složitější na implementaci a často přinášejí vyšší konstantní časovou režii, proto jsou v praxi pomalejší než standardní verze.
