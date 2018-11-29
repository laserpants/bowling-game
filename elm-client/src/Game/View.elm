module Game.View exposing (..)

import Game exposing (..)
import Html exposing (..)
import Html.Attributes exposing (class, rowspan)
import List exposing (length, range, sortBy)
import Utils

symbol : String -> Html Msg
symbol s = td [ class "frame" ] [ text s ]

blank : Html Msg
blank = td [ class "frame frame-blank" ] []

hit : Int -> Html Msg
hit n = case n of
      0  -> symbol "-"
      10 -> symbol "X"
      _  -> symbol (String.fromInt n)

frame : (Int, Frame) -> List (Html Msg)
frame (n, hits) =

  let pair j k = [ hit j , if 10 == j + k then symbol "/" else hit k ]
      isLast = 10 == n
   in case hits of

     [_]         -> blank :: symbol "X" :: blank :: []
                 -- ^ strike
     [j, k]      -> if isLast then pair j k ++ [blank] else blank :: pair j k
                 -- ^ normal frame; or last frame except when a strike or spare
     [10, 10, k] -> symbol "X" :: symbol "X" :: hit k :: []
                 -- ^ last frame: two strikes
     [10, j, k]  -> symbol "X" :: pair j k
                 -- ^ last frame: a strike followed by something else
     [i, j, k]   -> pair i j ++ [ hit k ]
                 -- ^ last frame: other cases
     _           -> []
                 -- ^ this is an error

scoreCard : Game -> Int -> Html Msg
scoreCard game i =

  let frames p = td [] [ table [] [ tr [] (frame p) ] ]
      scores n = td [ class "score" ] [ text (String.fromInt n) ]
      results  = List.map frames (Utils.zip (range 1 10) game.frames)

   in div [ class "score-card-container" ] 
          [ table [ class "score-card" ]
                  [ tr [] (td [ rowspan 2 ] [ text (String.fromInt i) ] :: results)
                  , tr [] (List.map scores game.score) ] ] 

round : List Game -> Html Msg
round players = 
  let sorted = sortBy (\g -> g.id) players
      ix     = range 1 (length players)
      cards  = Utils.zip sorted ix |> List.map (Utils.uncurry scoreCard) 
   in div [] cards
