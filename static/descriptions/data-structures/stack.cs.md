# Zásobník (LIFO)

**Zásobník** je lineární datová struktura, která následuje princip **Poslední dovnitř, první ven (LIFO)**. To znamená, že poslední prvek přidaný do zásobníku je první, který bude odebrán. Představte si to jako fyzický stoh talířů: nový talíř přidáte na vrchol a když jeden potřebujete, vezmete ho z vrcholu.

Zásobníky se používají v mnoha oblastech informatiky, včetně vyhodnocování výrazů, syntaktické analýzy a správy volání funkcí v paměti programu.

## Analýza složitosti

Protože zásobník umožňuje přístup pouze k vrchnímu prvku, všechny primární operace jsou extrémně efektivní.

| Operace        | Časová složitost | Účel                                          |
| -------------- | ---------------- | --------------------------------------------- |
| **Push**       | O(1)             | Přidání nového prvku na vrchol.               |
| **Pop**        | O(1)             | Odebrání vrchního prvku.                      |
| **Nahlédnutí** | O(1)             | Zobrazení vrchního prvku bez jeho odstranění. |
| **Prostor**    | O(n)             | Lineární prostor vzhledem k počtu prvků.      |

## Push

Operace push přidává nový prvek do kolekce. V zásobníku se tento nový prvek vždy stává novým "vrcholem".

1. **Vytvoření**: Pro hodnotu je vytvořen nový uzel nebo záznam.
2. **Propojení**: Nový prvek je umístěn "nad" aktuální vrchní prvek.
3. **Aktualizace vrcholu**: Interní reference zásobníku je aktualizována tak, aby ukazovala na tento nový prvek jako aktuální **vrchol**.

## Pop

Operace pop odstraňuje prvek, který je aktuálně na vrcholu zásobníku.

1. **Kontrola prázdnosti**: Pokud zásobník nemá žádné prvky, operace je zrušena, protože není co odstranit.
2. **Identifikace vrcholu**: Aktuální **vrcholový** prvek je cílen k odstranění.
3. **Aktualizace vrcholu**: Interní reference zásobníku je přesunuta "dolů" na prvek bezprostředně pod aktuálním vrcholem.
4. **Výsledek**: Odstraněný prvek je vrácen a zásobník je nyní o jeden prvek menší.

## Nahlédnutí (Vrchol)

Tato operace se používá k pozorování aktuálního stavu zásobníku bez jeho modifikace.

1. **Přístup k vrcholu**: Algoritmus se podívá na hodnotu aktuálně drženou na referenci **vrchol**.
2. **Vrácení**: Hodnota je zobrazena uživateli, ale struktura zásobníku zůstává přesně stejná.
