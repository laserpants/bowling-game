module Api exposing (..)

import Http

type alias Response a = Result Http.Error a

url : String
url = "http://localhost:4399"
