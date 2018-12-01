module Game exposing (..)

import Http
import Json.Decode exposing (..)

type alias Response a = Result Http.Error a

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
  | CreateResponse (Response Game)
  | AdvanceRequest
  | AdvanceResponse (Response Game)

type alias Config = { players : Int }

create : String -> Config -> Cmd Msg
create url conf = 

  let createCmd = Http.post
        { url    = url ++ "/games"
        , body   = Http.emptyBody
        , expect = Http.expectJson CreateResponse decoder }

   in Cmd.batch (List.repeat conf.players createCmd)

advance : String -> List Game -> Cmd Msg
advance url games = 

  let advanceCmd game = Http.post
        { url    = url ++ "/games/" ++ game.id ++ "/frames"
        , body   = Http.emptyBody
        , expect = Http.expectJson AdvanceResponse decoder }
  
   in Cmd.batch (List.map advanceCmd games)
