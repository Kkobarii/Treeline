# Fronta (FIFO)

**Fronta** je lineární datová struktura, která funguje na principu **První dovnitř, první ven (FIFO)**. To znamená, že první prvek přidaný do fronty bude první, který bude odebrán. Funguje přesně jako fronta v reálném životě: osoba na začátku fronty je obsloužena první a noví lidé se připojují na konec fronty.

Fronty jsou v informatice nezbytné pro správu prostředků sdílených více procesy, jako jsou tiskové úlohy, plánování CPU nebo zpracování požadavků na webovém serveru.

## Analýza složitosti

Podobně jako zásobník je fronta vysoce optimalizována pro své specifické vstupní a výstupní body. Omezením přístupu pouze na "začátek" a "konec" dosahujeme konstantního časového výkonu.

| Operace                | Časová složitost | Účel                                         |
| ---------------------- | ---------------- | -------------------------------------------- |
| **Vložení (Enqueue)**  | O(1)             | Přidání nového prvku na konec fronty.        |
| **Odebrání (Dequeue)** | O(1)             | Odebrání prvku ze začátku fronty.            |
| **Nahlédnutí**         | O(1)             | Zobrazení prvního prvku bez jeho odstranění. |
| **Prostor**            | O(n)             | Lineární prostor vzhledem k počtu prvků.     |

## Vložení (Enqueue)

Operace vložení přidává prvek na "konec" fronty.

1. **Vytvoření**: Pro hodnotu je vytvořen nový uzel nebo záznam.
2. **Propojení s koncem**: Ukazatel `další` aktuálního "koncového" prvku je aktualizován tak, aby ukazoval na nový uzel.
3. **Aktualizace konce**: Interní reference fronty pro **konec** je přesunuta na tento nový uzel. Pokud byla fronta předtím prázdná, tento uzel se stává také **začátkem**.

## Odebrání (Dequeue)

Operace odebrání odstraňuje prvek aktuálně na "začátku" fronty.

1. **Kontrola prázdnosti**: Pokud je fronta prázdná, operace je zrušena.
2. **Identifikace začátku**: Aktuální **začáteční** prvek je cílen k odstranění.
3. **Posun začátku**: Interní reference fronty pro **začátek** je přesunuta na další prvek ve frontě.
4. **Finalizace**: Starý počáteční uzel je odpojen. Pokud se fronta po tomto stane prázdnou, **konec** je také nastaven na null.

## Nahlédnutí (Začátek)

Tato operace vám umožňuje vidět, kdo je další ve frontě, aniž byste ho skutečně odebrali.

1. **Přístup k začátku**: Algoritmus se podívá na hodnotu drženou referencí **začátek**.
2. **Vrácení**: Hodnota je vrácena k použití, ale fronta zůstává zcela nezměněna.
