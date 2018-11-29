module Utils exposing (..)

zip : List a -> List b -> List (a, b)
zip fst snd =
  case (fst, snd) of
    (x::xs, y::ys) -> (x, y) :: zip xs ys
    _              -> []

uncurry : (a -> b -> c) -> (a, b) -> c
uncurry f = \(a, b) -> f a b
