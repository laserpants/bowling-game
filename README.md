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

Avancerar en pågående spelomgång genom att beräkna en ny uppställning.

```json
{
  "game_id": "ba6b636f4f23"
}
```

##### `stats/:game_id`

Visar statistik för ett pågående eller avslutat spel.

```json
{
  "game_id": "ba6b636f4f23"
}
```

#### Klient

Klientappen kommer vara webbläsarbaserad och använda antingen React eller Elm som utvecklingsverktyg.

### Plan

|               |                        |            |
|---------------|------------------------|------------|
| M&aring;ndag  | Projektupplägg         | 1-3 timmar |
| Tisdag        | API                    | 1-3 timmar |
| Onsdag        | API                    | 1-3 timmar |
| Torsdag       | Klientapp              | 1-3 timmar |
| Fredag        | Klientapp              | 1-3 timmar | 
| L&ouml;rdag   | Premiärfest på Café Opera :smiley: | 

### Test

### Dokumentation
