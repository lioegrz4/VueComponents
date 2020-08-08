const ZERO  = 0
    , NONE  = 1
    , SOME  = 2
    , ALL   = 3
      // SOME 可以短路
      // 沿'左上-右下'轴对称，符合交换律
    , BINOP = [ [ZERO, NONE, SOME, ALL ]
              , [NONE, NONE, SOME, SOME]
              , [SOME, SOME, SOME, SOME]
              , [ALL , SOME, SOME, ALL ]
              ]

module.exports = { ZERO
                 , NONE
                 , SOME
                 , ALL
                 , BINOP
                 }
