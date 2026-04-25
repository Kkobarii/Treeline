# B-strom

B-strom je komplexní, samovyvažující se vyhledávací strom navržený pro efektivní zpracování masivních objemů dat. Na rozdíl od typických binárních vyhledávacích stromů, kde každý uzel obsahuje jedinou hodnotu a dva ukazatele, je uzel B-stromu navržen tak, aby pojal více hodnot a ukazoval na mnoho potomků. Tato široká a mělká struktura jej činí jedinečně vhodným pro systémy, které čtou a zapisují velké bloky dat, jako jsou databáze a souborové systémy.

### Klíčové koncepty

- **Řád:** Řád B-stromu definuje jeho celkovou kapacitu. V této implementaci řád `m` představuje maximální počet potomků, které může mít jediný uzel. Stojí za zmínku, že některé texty místo toho definují řád jako minimální počet potomků, ale zde se používá definice s maximálním počtem potomků.
- **Struktura uzlu:** Každý uzel obsahuje pole seřazených hodnot a pole ukazatelů na potomky. Uzel s `k` potomky bude vždy obsahovat `k - 1` hodnot. Hodnoty fungují jako oddělovače, které rozdělují ukazatele na potomky do specifických rozsahů.
- **Vnitřní a listové uzly:** Vnitřní uzly obsahují jak hodnoty, tak ukazatele na potomky a slouží jako směrovací body. Listové uzly obsahují pouze hodnoty, nacházejí se na samém dně stromu a nemají žádné ukazatele na potomky.

### Pravidla

- **Kapacitní limity:** Uzel může mít nejvýše `m` potomků a `m - 1` hodnot.
- **Minimální limity:** Každý vnitřní uzel (kromě kořene) musí mít alespoň `Math.ceil(m / 2)` potomků, což zajišťuje, že strom zůstane hustý.
- **Seřazené hodnoty:** Hodnoty uvnitř jednoho uzlu jsou uloženy ve striktně rostoucím pořadí.
- **Vlastnost vyhledávacího stromu:** Pro jakoukoli hodnotu `V` v uzlu platí, že všechny hodnoty v podstromu potomka po její levé straně jsou ostře menší než `V` a všechny hodnoty v podstromu potomka po její pravé straně jsou ostře větší než `V`.
- **Jednotná hloubka:** Všechny listové uzly se musí nacházet ve stejné hloubce, což zaručuje dokonalé vyvážení napříč celou strukturou.

Tato konkrétní implementace ukazuje B-strom **řádu 5**, což znamená, že každý uzel může mít až **5 potomků** a **4 hodnoty**. Minimální počet potomků pro vnitřní uzly (kromě kořene) je **3**. To zajišťuje, že strom zůstane vyvážený a efektivní i při svém růstu.

### Analýza složitosti

Vzhledem k tomu, že je B-strom dokonale vyvážený a každý uzel uchovává více hodnot, je výška stromu výrazně zredukována ve srovnání se standardními binárními stromy. Výška zůstává na `O(log n)` a protože základ logaritmu je velký (na základě řádu `m`), strom zůstává neuvěřitelně mělký i s miliony záznamů.

| Operace      | Nejhorší případ |
| :----------- | :-------------- |
| **Vložení**  | `O(log n)`      |
| **Nalezení** | `O(log n)`      |
| **Smazání**  | `O(log n)`      |

## Vložení

Vkládání vždy probíhá na úrovni listů. Místo toho, aby B-strom rostl směrem dolů jako standardní binární strom, roste směrem nahoru, když uzlům dojde místo.

### Fáze 1: Hledání a vložení

1. **Porovnání:** Začíná se v kořeni a postupuje se stromem dolů, aby se nalezl příslušný listový uzel skenováním seřazených hodnot.
2. **Průchod:** Rozhodne se o cestě na základě porovnání:
    - Pokud je nová hodnota menší než daná hodnota, sleduje se ukazatel na potomka nalevo od této hodnoty.
    - Pokud je nová hodnota větší než všechny hodnoty v uzlu, sleduje se ukazatel na potomka nejvíce vpravo.
3. **Vložení hodnoty:** Jakmile je nalezen správný list, nová hodnota se vloží do pole hodnot uzlu, přičemž se zajistí, že pole zůstane seřazené.

### Fáze 2: Rozdělení a povýšení

1. **Označení přeplnění:** Pokud vložení způsobí, že uzel překročí maximální povolený počet hodnot, je uzel označen jako přeplněný a musí být rozdělen.
2. **Rozdělení:** Přeplněný uzel je rozdělen uprostřed na dva samostatné, menší uzly:
    - Levý uzel, který bude obsahovat menší polovinu hodnot.
    - Pravý uzel, který bude obsahovat větší polovinu hodnot.
3. **Povýšení středu:** Prostřední hodnota původního přeplněného uzlu je vytlačena nahoru (povýšena) do rodičovského uzlu.
    - Tato povýšená hodnota funguje jako nový oddělovač mezi dvěma nově rozdělenými uzly.
    - Pokud neexistuje žádný rodič (což znamená, že k rozdělení došlo v kořeni), vytvoří se nový kořen a zvýší se celková výška stromu.
4. **Propagace:** Pokud povýšení prostřední hodnoty způsobí, že se rodičovský uzel stane přeplněným, proces rozdělení a povýšení se opakuje na rodiči.
    - Tato operace může kaskádovitě postupovat směrem nahoru a potenciálně dosáhnout až ke kořeni.

## Nalezení

Prohledávání B-stromu spoléhá na zobecněnou vyhledávací logiku, která kontroluje více hodnot v jednom uzlu.

1. **Porovnání:** Začíná se v kořeni a skenují se seřazené hodnoty v aktuálním uzlu.
2. **Nalezeno:** Pokud se hledaný cíl shoduje s hodnotou, uzel byl úspěšně nalezen.
3. **Průchod:** O cestě dál se rozhoduje na základě porovnání:
    - Pokud je cíl menší než daná hodnota, sleduje se ukazatel na potomka nalevo od této hodnoty.
    - Pokud je cíl větší než všechny hodnoty v uzlu, sleduje se ukazatel na potomka nejvíce vpravo.
4. **Nenalezeno:** Pokud se dosáhne listového uzlu a hodnota v něm není přítomna, hledání končí, hodnota ve stromu neexistuje.

## Smazání

Odstranění je složité, protože musí zachovat požadavky na minimální hodnoty a jednotnou hloubku stromu, aniž by došlo k porušení pravidel uspořádání.

### Fáze 1: Nalezení a odstranění

Prvním krokem je nalezení hodnoty a její bezpečné odstranění, což se liší v závislosti na tom, kde se hodnota nachází.

1. **Případ 1: Hodnota v listovém uzlu:** Pokud se cílová hodnota nachází v listovém uzlu, je jednoduše odstraněna z pole hodnot uzlu.
2. **Případ 2: Hodnota ve vnitřním uzlu:** Pokud se hodnota nachází ve vnitřním uzlu, nelze ji jednoduše odstranit bez porušení směrovací struktury.
    - Strom najde buď in-order předchůdce (největší hodnotu v podstromu levého potomka), nebo in-order následníka (nejmenší hodnotu v podstromu pravého potomka).
    - Cílová hodnota je přepsána tímto předchůdcem nebo následníkem.
    - Původní předchůdce nebo následník je poté označen ke smazání ze svého příslušného listového uzlu.

### Fáze 2: Opětovné vyvážení (Podtečení)

Pokud odstranění hodnoty způsobí, že uzel klesne pod svůj minimální požadovaný počet hodnot, dojde k podtečení (underflow). Strom musí stáhnout data z okolních uzlů, aby obnovil vyvážení.

1. **Případ 1: Výpůjčka od levého sourozence:** Pokud má bezprostřední levý sourozenec více než minimální počet hodnot, vypůjčí se hodnota k zaplnění mezery.
    - Největší hodnota z levého sourozence se přesune nahoru do rodiče.
    - Oddělující hodnota z rodiče se přesune dolů do podtékajícího uzlu.
    - Pokud uzly nejsou listy, ukazatel na potomka nejvíce vpravo levého sourozence je převeden a stává se ukazatelem na levého potomka podtékajícího uzlu.
2. **Případ 2: Výpůjčka od pravého sourozence:** Pokud má bezprostřední pravý sourozenec volné hodnoty, vypůjčí se hodnota od něj.
    - Nejmenší hodnota z pravého sourozence se přesune nahoru do rodiče.
    - Oddělující hodnota z rodiče se přesune dolů do podtékajícího uzlu.
    - Pokud uzly nejsou listy, ukazatel na potomka nejvíce vlevo pravého sourozence je převeden a stává se ukazatelem na pravého potomka podtékajícího uzlu.
3. **Případ 3: Sloučení potomků:** Pokud žádný ze sourozenců nemá volné hodnoty k zapůjčení, musí být podtékající uzel sloučen s jedním ze svých sourozenců.
    - Oddělující hodnota rodiče je stažena dolů.
    - Tato oddělující hodnota je zkombinována s hodnotami obou sourozenců a vytvoří tak jeden plný uzel.
    - Všechny ukazatele na potomky z obou sourozenců jsou převedeny a sloučeny do tohoto nového uzlu v jejich správném pořadí.
    - Vzhledem k tomu, že rodič ztratí hodnotu, může nyní také podtéci. To způsobí, že proces opětovného vyvažování bude kaskádovitě pokračovat nahoru.

## Poznámky

B-stromy se univerzálně používají v systémech správy databází a souborových systémech (jako NTFS, ext4 nebo APFS).

Vzhledem k tomu, že přístup k sekundárnímu úložišti (jako je pevný disk nebo SSD) je ve srovnání s přístupem k RAM notoricky pomalý, je B-strom explicitně navržen tak, aby zabalil co nejvíce dat do jediného velkého uzlu. Tím se minimalizuje počet přístupů na disk nutných k nalezení informace, což z něj dělá pro masivní datové sady reálného světa strukturu mnohem lepší než standardní binární stromy.
