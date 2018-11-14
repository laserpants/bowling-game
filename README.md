# bowling-game :bowling:

Ett bowlingspel där två personer spelar mot varandra. 

### Installation

TODO

#### Grundförutsättning

* Node och npm

#### API-server

```bash
npm install
```

```bash
npm start
```

#### Miljövariabler

| Variabel      |                             |            |
|---------------|-----------------------------|------------|
| PORT          |                             | 4399       |

### Beskrivning

En omgång startar med att användaren klickar på en knapp och genererar ett slumpvis resultat. Förloppet visas i tabellform. Vanliga [bowlingregler](http://www.alltombowling.nu/skola_rakna.php) gäller. Spärr och strike ska också kunna genomföras.

### Lösning

Lösningen innefattar en API-del samt en klientdel. 

#### HTTP API

##### `POST /games`

En ny spelomgång (serie) registreras. Returnerar ett unikt ID som används i efterföljande anrop.

**Exempel:**

```bash
curl -X POST http://localhost:4399/games
```

```json
{
  "game": {
    "id": "1ljz9uxjogpc51o"
  }
}
```

##### `POST /games/:game_id/frames`

Avancerar en pågående spelomgång genom att beräkna en ny uppställning. Vid en uppställning har spelaren två försök att välta samtliga käglor. Se [nedan](#bakgrund) för resonemang kring den bakomliggande processen. Om spelomgången redan är avslutad returneras felkoden `410 Gone`.

**Exempel:**

```bash
curl -X POST http://localhost:4399/games/1ljzfxyjoh72joh/frames
```

```json
{
  "game": {
    "id": "1ljzfxyjoh72joh",
    "frames": [
      [ 7, 1 ],
      [ 9, 0 ],
      [ 1, 6 ],
      [ 4, 2 ],
      [ 1, 7 ],
      [ 0, 2 ],
      [ 3, 3 ],
      [ 8, 2 ],
      [ 1, 1 ],
      [ 7, 3, 7 ]
    ],
    "complete": false
  },
  "frame": [ 7, 3, 7 ]
}
```

##### `GET /games/:id`

Visar information om ett pågående eller avslutat spel.

**Exempel:**

```bash
curl http://localhost:4399/games/1ljzfxyjoh757va
```

```json
{
  "game": {
    "id": "1ljzfxyjoh757va",
    "frames": [
      [ 4, 2 ],
      [ 1, 7 ],
      [ 0, 2 ],
      [ 3, 3 ]
    ],
    "complete": false
  }
}
```

#### Poängberäkning 

TODO

#### Klient

Klientappen kommer vara webbläsarbaserad och använda JavaScript som utvecklingsspråk.

### Plan

| Dag           | Aktivitet                   | Timmar     |    |
|---------------|-----------------------------|------------|----|
| M&aring;ndag  | Projektupplägg              | 1-3 timmar | :heavy_check_mark: |
| Tisdag        | API                         | 1-3 timmar | :heavy_check_mark: |
| Onsdag        | API                         | 1-3 timmar | :heavy_check_mark: |
| Torsdag       | Klientapp                   | 1-3 timmar |    |
| Fredag        | Klientapp                   | 1-3 timmar |    |
| L&ouml;rdag   | Test och dokumentation      | 1-3 timmar |    |
| S&ouml;ndag   | Premiärfest på Café Opera?  |            |    |

| Dag           | Aktivitet                   | Timmar     |
|---------------|-----------------------------|------------|
| Vecka 2       | Utforska alternativa idéer (se nedan) | 3-6 timmar |

### Bakgrund

```
6 7 8 9
 3 4 5
  1 2 
   0
```

Spelaren genomför ett eller två slag vid varje uppställning. Detta resulterar i en av 2^10 = 1024 möjliga konfigurationer av käglor, där varje enskild kägla antingen kan ha slagits ut eller lämnats intakt. T.ex.,

```
6 7 8 9    - - - 9    6 7 8 9    - - - -    6 7 8 9
 - - 5      - 4 -      - - -      - - -      3 - 5
  1 -        - -        - -        - -        1 2
   0          0          0          -          0
```

#### En kort parentes om alternativa idéer

I ett färdighetsbaserat spel (vilket riktig bowling i allra högstra grad är) kan man tänka sig att spelaren styr förloppet genom att använda t.ex. muspekaren eller tangentbordet. En fysikmotor, som Box2D, kan då användas för att beräkna klotets rörelse och samverkan med käglorna, genom vilket man uppnår ett mer intressant resultat.

##### Simulering

En annan rolig variant skulle vara att spelaren har möjlighet att ange ett antal inparametrar och att spelförloppet bygger på någon Game of Life-liknande simulering där de mönster som uppstår avgör vilka käglor som träffas av klotet. Detta kan vara värt att utforska senare.

#### En slumptalsbaserad modell

I den nuvarande lösningen har spelaren inte någon möjlighet att påverka resultatet, utan vi förlitar oss på slumpen och en naiv sannolikhetsfördelning.

Låt *k* vara antalet käglor spelaren slår ut i första slaget och *j* antalet utslagna käglor i andra slaget, där *0 ≤ k ≤ 10* och *0 ≤ j ≤ (10 - k)*. För enkelhets skull antar vi att *P(k = k₀) = 1:11* för samtliga *k₀* och *P(j = j₀) = 1:(10 - k + 1)* för samtliga *j₀*. Om vi vill veta exakt vilka käglor som slagits ut (dvs. inte bara antalet) finns det *C(10, k)* möjliga sätt att slå ut *k* käglor, där *C(n, k)* är binomialkoefficienten (*n* över *k*), och vi kan åter igen använda en uniform sannolikhetsfördelning över denna mängd. Detta är inte speciellt realistiskt om man tar i beaktande, t.ex., de två konfigurationerna nedan, där den till höger inträffar betydligt oftare än den till vänster. Vi bortser dock för tillfället från dessa mer teoretiska problemställningar.

```
6 7 8 9   6 7 8 -
 3 - 5     3 4 5
  1 2       1 2
   0         0
```

### Test

```bash
npm test
```

### Dokumentation

```bash
npm run docs
```
