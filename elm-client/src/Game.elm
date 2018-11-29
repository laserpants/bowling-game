module Game exposing (..)

import Api
import Http
import Json.Decode exposing (..)

type alias Frame = List Int

type alias Game =
  { id     : String
  , over   : Bool
  , frames : List Frame
  , score  : List Int
  , total  : Maybe Int }

decoder : Decoder Game
decoder =
  let game = map5 Game
        (field "id" string)
        (field "complete" bool)
        (field "frames" (list (list int)))
        (field "score" (list int))
        (maybe (field "currentTotal" int))
   in field "game" game

type Msg
  = CreateRequest
  | CreateResponse (Api.Response Game)
  | AdvanceRequest
  | AdvanceResponse (Api.Response Game)

createCmd : Cmd Msg
createCmd = Http.post
  { url    = Api.url ++ "/games"
  , body   = Http.emptyBody
  , expect = Http.expectJson CreateResponse decoder }

advanceCmd : Game -> Cmd Msg
advanceCmd game = Http.post
  { url    = Api.url ++ "/games/" ++ game.id ++ "/frames"
  , body   = Http.emptyBody
  , expect = Http.expectJson AdvanceResponse decoder }

type alias Config = { players : Int }

create : Config -> Cmd Msg
create conf = Cmd.batch (List.repeat conf.players createCmd)

advance : List Game -> Cmd Msg
advance = Cmd.batch << List.map advanceCmd
