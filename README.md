# bowling-game :bowling:

Ett bowlingspel där två personer spelar mot varandra. 

### Beskrivning

En omgång startar med att användaren klickar på en knapp och genererar ett slumpvis resultat. Förloppet visas i tabellform. Vanliga [bowlingregler](http://www.alltombowling.nu/skola_rakna.php) gäller. Spärr och strike ska också kunna genomföras.

### Lösning

Lösningen bygger på en enkel API-del och en klientdel. 

#### API

##### `start`

En ny spelomgång (serie) registreras. Returnerar ett unikt ID som används i efterföljande anrop.

```json
{
  "game_id": "ba6b636f4f23"
}
```

##### `roll/:game_id`

Avancerar en pågående spelomgång genom att beräkna en ny uppställning. Vid en uppställning har spelaren två försök att välta samtliga käglor. Se [nedan](#resonemang) för resonemang kring den bakomliggande processen.

```json
{
}
```

##### `stats/:game_id`

Visar statistik för ett pågående eller avslutat spel.

```json
{
}
```

#### Klient

Klientappen kommer vara webbläsarbaserad och använda antingen React eller Elm som utvecklingsverktyg.

### Plan

| Dag           | Aktivitet                   | Timmar     |
|---------------|-----------------------------|------------|
| M&aring;ndag  | Projektupplägg              | 1-3 timmar |
| Tisdag        | API                         | 1-3 timmar |
| Onsdag        | API                         | 1-3 timmar |
| Torsdag       | Klientapp                   | 1-3 timmar |
| Fredag        | Klientapp                   | 1-3 timmar | 
| L&ouml;rdag   | Test och dokumentation      | 1-3 timmar | 
| S&ouml;ndag   | Premiärfest på Café Opera?  |            |

### Resonemang

```
6 7 8 9
 3 4 5
  1 2 
   0
```

Spelaren genomför ett eller två slag vid varje uppställning. Detta resulterar i en av 2^10 = 1024 möjliga konfigurationer av käglor, där varje enskild kägla antingen kan ha slagits ut eller lämnats intakt.

```
6 7 8 9    - - - 9    6 7 8 9    - - - -    6 7 8 9
 - - 5      - 4 -      - - -      - - -      3 - 5
  1 -        - -        - -        - -        1 2
   0          0          0          -          0
```

#### Interaktivt spel

I ett färdighetsbaserat spel (vilket riktig bowling i allra högstra grad är) kan man tänka sig att spelaren styr förloppet genom att använda t.ex. muspekaren eller tangentbordet. En fysikmotor, som Box2D, kan då användas för att beräkna klotets rörelse och samverkan med käglorna, genom vilket man uppnår ett mer intressant resultat.

#### Slumptalsbaserad

I detta fall har inte spelaren någon möjlighet att påverka resultatet, utan vi förlitar oss på slumpen och en  sannolikhetsfördelning.

Låt *k* vara antalet käglor spelaren slår ut i första slaget och *j* antalet utslagna käglor i andra slaget, där *0 ≤ k ≤ 10* och *0 ≤ j ≤ (10 - k)*. Vi antar att P(k = k₀) = 1:11 och P(j = j₀) = 1:(10 - k + 1).

### Test

### Dokumentation
