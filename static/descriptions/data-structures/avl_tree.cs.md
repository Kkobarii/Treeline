# AVL strom (samovyvažující se binární vyhledávací strom)

**AVL strom** (pojmenovaný po vynálezcích Adelson-Velském a Landisovi) je samovyvažující se verze binárního vyhledávacího stromu. Zatímco standardní BST se může stát nevyváženým a pomalým, AVL strom zajišťuje, že výška levého a pravého podstromu libovolného uzlu se liší maximálně o **jedna**. Tato rovnováha je udržována pomocí vlastnosti zvané **faktor vyvážení** a různých **rotací**.

## Analýza složitosti

Protože se strom automaticky vyvažuje po každém vložení a odstranění, je výška zaručeně logaritmická. To zajišťuje, že operace zůstávají efektivní i v nejhorších případech.

| Operace    | Nejhorší případ |
| ---------- | --------------- |
| Hledání    | O(log n)        |
| Vložení    | O(log n)        |
| Odstranění | O(log n)        |

## Klíčové pojmy

- **Výška**: Délka nejdelší cesty od uzlu k listu.
- **Faktor vyvážení**: Vypočítá se jako `Výška(levý podstrom) - Výška(pravý podstrom)`. Uzel je považován za vyvážený, pokud je jeho faktor **-1, 0 nebo 1**.
- **Rotace**: Specifické pohyby používané k restrukturalizaci stromu, když se uzel stane nevyváženým (faktor > 1 nebo < -1). Čtyři typy rotací jsou:
    - **Levá-levá (LL) rotace**
    - **Pravá-pravá (RR) rotace**
    - **Levá-pravá (LR) rotace**
    - **Pravá-levá (RL) rotace**

## Vyhledávání (Hledání)

Vyhledávání v AVL stromu je totožné se standardním binárním vyhledávacím stromem.

1. **Porovnání**: Začněte v kořeni a porovnejte hledanou hodnotu s aktuálním uzlem.
2. **Shoda**: Pokud jsou stejné, hodnota byla nalezena.
3. **Procházení**:
    - Pokud je hledaná hodnota **menší**, přejděte na **levého potomka**.
    - Pokud je hledaná hodnota **větší**, přejděte na **pravého potomka**.

4. **Ukončení**: Pokud narazíte na prázdné místo, hodnota ve stromu neexistuje.

## Vložení

Vložení je dvoufázový proces: nalezení místa pro vložení a následná "oprava" stromu při návratu ke kořeni.

**Fáze 1: Standardní vložení do BST**

- Procházejte strom pomocí porovnávání, dokud nenaleznete prázdné místo.
- **Vytvoření listu**: Na této pozici je vytvořen nový uzel.
- **Zpracování duplicit**: Pokud hodnota již existuje, operace je zrušena.

**Fáze 2: Vyvážení**:
Algoritmus se vrací zpět po cestě použité při vkládání:

1. **Aktualizace výšky a vyvážení**: Pro každý uzel na cestě je aktualizována výška a přepočítán faktor vyvážení.
2. **Kontrola vyvážení**: Pokud je faktor vyvážení uzlu větší než 1 nebo menší než -1, provede se rotace na základě "tvaru" nevyváženosti:
    - **Levá-levá (LL)**: Pravá rotace.
    - **Pravá-pravá (RR)**: Levá rotace.
    - **Levá-pravá (LR)**: Levá rotace potomka, poté pravá rotace uzlu.
    - **Pravá-levá (RL)**: Pravá rotace potomka, poté levá rotace uzlu.

## Odstranění (Smazání)

Odstranění je nejnáročnější operace, protože kombinuje logiku odstranění z BST s potenciální sérií vyvažovacích rotací.

**Fáze 1: Vyhledání a označení**

- Strom je procházen pro nalezení cílového uzlu, přičemž je zaznamenávána cesta.
- Po nalezení je uzel **označen k odstranění**.

**Fáze 2: Odstranění uzlu**

- **Žádný potomek / jeden potomek**: Uzel je odstraněn a jeho potomek (pokud existuje) je povýšen na jeho místo.
- **Dva potomci**: Algoritmus najde **následníka v inorder pořadí** (nejmenší uzel v pravém podstromu). Hodnota a identita následníka jsou přesunuty na pozici cílového uzlu a původní uzel následníka je odstraněn ze spodní části stromu.

**Fáze 3: Vyvážení**:
Stejně jako při vkládání, algoritmus se vrací zpět po uložené cestě ke kořeni:

1. **Aktualizace výšky a vyvážení**: V každém kroku jsou přepočítány výšky.
2. **Kontrola vyvážení**: Pokud se uzel stane nevyváženým kvůli odstranění, je aplikována příslušná rotace (LL, RR, LR nebo RL) pro obnovení vlastnosti AVL. Na rozdíl od vkládání může jedno odstranění vyžadovat více rotací při pohybu nahoru stromem.
