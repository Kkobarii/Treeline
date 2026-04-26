# Vyhledávací algoritmy

Vyhledávací algoritmy jsou základní procesy používané k získání konkrétní informace z datové sady. Zatímco třídicí algoritmy data reorganizují, vyhledávací algoritmy je pouze procházejí. Efektivita vyhledávání je primárně určena tím, zda jsou podkladová data již setříděná, nebo zcela náhodná.

## Lineární vyhledávání

Lineární vyhledávání je nejzákladnější vyhledávací algoritmus. Funguje tak, že se sekvenčně kontroluje každý jednotlivý prvek v datové sadě od začátku do konce, dokud se nenajde cílová hodnota nebo se nedosáhne konce seznamu.

### Vlastnosti

- **Paměťová složitost:** `O(1)`
- **Předpoklad:** Žádný. Algoritmus funguje na nesetříděných datech.
- **Paradigma:** Hrubá síla.

### Algoritmus

1. **Procházení:** Začne se na začátku pole a iteruje se přes indexy jeden po druhém.
2. **Porovnání:** Zkontroluje se, zda se hodnota na aktuálním indexu rovná cílové hodnotě.
3. **Výsledek:** Pokud je nalezena shoda, vyhledávání je úspěšné. Pokud smyčka skončí bez shody, cíl nebyl nalezen.

## Binární vyhledávání

Binární vyhledávání je optimalizovaný algoritmus, který dramaticky zkracuje dobu vyhledávání systematickým půlením prohledávané oblasti. Využívá se zde stejná matematická logika, jako u standardního binárního vyhledávacího stromu, ale místo navigace v hierarchii založené na uzlech se naviguje v plochém poli pomocí indexové matematiky.

### Vlastnosti

- **Paměťová složitost:** `O(1)`
- **Předpoklad:** Pole musí být předem striktně setříděné.
- **Paradigma:** Rozděl a panuj.

### Algoritmus

1. **Inicializace hranic:** Nastaví se levá hranice na začátek a pravá hranice na konec pole.
2. **Porovnání středu:** Najde se středový index aktuálního okna a porovná se jeho hodnota s cílem.
3. **Úprava hranic:** Pokud je cíl větší než střední hodnota, levá polovina se zahodí posunutím levé hranice za střed. Pokud je menší, zahodí se pravá polovina posunutím pravé hranice.
4. **Výsledek:** Opakuje se, dokud není cíl nalezen nebo dokud levá hranice nepřekročí pravou hranici, to znamená, že hodnota neexistuje.

## Analýza složitosti

Lineární vyhledávání škáluje přímo úměrně s počtem prvků, proto je u masivních datových sad pomalé. Binární vyhledávání dělí vyhledávací prostor dvěma v každém kroku a pracuje v logaritmickém čase. U pole s miliardou prvků najde binární vyhledávání cíl ve zhruba 30 porovnáních, zatímco lineární vyhledávání v nejhorším případě by jich vyžadovalo celou miliardu.

| Algoritmus               | Nejlepší případ | Průměrný případ | Nejhorší případ | Paměť  |
| :----------------------- | :-------------- | :-------------- | :-------------- | :----- |
| **Lineární vyhledávání** | `O(1)`          | `O(n)`          | `O(n)`          | `O(1)` |
| **Binární vyhledávání**  | `O(1)`          | `O(log n)`      | `O(log n)`      | `O(1)` |

## Další algoritmy

Zatímco lineární a binární vyhledávání jsou základní, pro specifické situace existuje několik dalších technik:

- **Jump Search:** Střední cesta, která funguje na setříděných polích tak, že se přeskakuje o pevně stanovené kroky vpřed pro nalezení správného obecného bloku, a po tomto kroku následuje krátké lineární vyhledávání v rámci tohoto bloku.
- **Interpolační vyhledávání:** Odhadne se pozice cíle na základě jeho hodnoty (podobně jako při otevírání slovníku), tento přístup je vysoce efektivní pro rovnoměrně rozložená data.
- **Exponenciální vyhledávání:** Najde se platný rozsah zdvojnásobením indexu horní hranice a následně se v tomto finalizovaném rozsahu provede standardní binární vyhledávání.
- **Hašování:** Využívá se matematický vzorec pro mapování klíčů přímo na indexy. Hašovací tabulky dosahují konstantní doby vyhledávání `O(1)` úplným vynecháním porovnávání.

## Poznámky

Běžnou chybou je předpoklad, že pole by mělo být vždy setříděné jen proto, aby se dalo použít binární vyhledávání. Setřídění pole zabere čas `O(n log n)`. Pokud se bude datová sada prohledávat pouze jednou, provedení jednoduchého lineárního vyhledávání v čase `O(n)` je matematicky rychlejší. Binární vyhledávání přináší čistý výkonnostní zisk pouze v případě, že se pole bude po setřídění prohledávat vícekrát.

Binární vyhledávání navíc nelze použít na standardní spojové seznamy. Přesun na středový index spojového seznamu vyžaduje procházení v čase `O(n)` a tím se zcela vytrácí smysl logaritmické matematiky.
