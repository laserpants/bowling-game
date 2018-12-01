module Main exposing (..)

import Browser
import Debug
import Game exposing (Frame, Game)
import Game.View exposing (..)
import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (..)
import Http
import List

type Msg = GameMsg Game.Msg

type Status = Pending | Wait | Error | Ongoing | Complete

type alias Model =
  { round   : List Game
  , next    : List Game
  , status  : Status
  , players : Int 
  , api     : String }

initialModel : Model
initialModel =
  { round   = []
  , next    = []
  , status  = Pending
  , players = 2 
  , api     = "http://localhost:4399" }

init : () -> (Model, Cmd Msg)
init () = (initialModel, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =

  let nextModel result = case result of

        Ok game -> let next = game :: model.next
                       done = model.players == List.length next
                    in
                       if done then { round   = next
                                    , next    = []
                                    , status  = if game.over then Complete
                                                             else Ongoing
                                    , players = model.players 
                                    , api     = model.api }
                               else { model | next = next }

        Err _ -> { model | status = Error }

   in case msg of

        GameMsg Game.CreateRequest ->
          ({ model | next = [], status = Wait },
            Cmd.map GameMsg (Game.create model.api { players = model.players }))

        GameMsg Game.AdvanceRequest ->
          ({ model | next = [], status = Wait },
            Cmd.map GameMsg (Game.advance model.api model.round))

        GameMsg (Game.CreateResponse result) -> (nextModel result, Cmd.none)
        GameMsg (Game.AdvanceResponse result) -> (nextModel result, Cmd.none)

subscriptions : Model -> Sub Msg
subscriptions _ = Sub.none

view : Model -> Html Msg
view model =

  case model.status of

    Pending ->
      div [ class "game-container" ] [ button [ onClick (GameMsg Game.CreateRequest) ]
                                              [ text "Start the game" ] ]

    Ongoing ->
      div [ class "game-container" ] 
          [ div [] [ Html.map GameMsg (Game.View.round model.round) ] 
          , div [ class "game-container" ] 
                [ button [ onClick (GameMsg Game.AdvanceRequest) ] 
                         [ text "Play next frame" ] ] ]

    Wait ->
      div [ class "game-container" ] [ text "Please wait..." ]

    Error ->
      div [ class "game-container" ] [ text "Something went wrong!" ]

    Complete ->
      div [ class "game-container" ]
          [ Html.map GameMsg (Game.View.round model.round)
          , button [ onClick (GameMsg Game.CreateRequest) ]
                   [ text "Start a new game" ] ]
  
main : Program () Model Msg
main = Browser.element
  { init          = init
  , update        = update
  , subscriptions = subscriptions
  , view          = view }
