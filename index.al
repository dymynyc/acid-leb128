
(module
  (def strings (import "acid-strings"))
  (def ints (import "acid-ints"))
  ;;HACK: used once to make a sneaky global var
  (def mem (import "acid-memory"))

  [def incrs (mac (i v) &(set $i (add $i $v)))]

  {export encoding_length (fun (i)
    [if (eq 0 i) 1
      (block
        (def len 0)
        (loop (gt i 0)
          [block
            (set i (shr i 7))
            (incrs len 1)
          ])
        len )]
  )}

  ;;HACK! store bytes decoded in data section.
  ;;      decode really needs to be able to return two values

  (def _bytes (mem.alloc 4))
  (export bytes (fun () (i32_load _bytes) ))

  {export encode (fun (i string start)
    (if (eq 0 i) (block (strings.set_at string start 0) 1)
      (block
        (def len 0)
        (loop (gt i 0)
          (block
            [strings.set_at string (add start len)
              (or (and i 127) (if (gt i 127) 128 0))]
            (set i (shr i 7))
            (incrs len 1)
            ))
        (i32_store _bytes len) ))
  )}

  {export decode (fun (string start)
    [block
      (def i 0)
      (def len 0)
      (def shift 0)
      (loop (block
          [def v (strings.at string (add start len))]
          (set i (or i (shl (and v 127) shift)))
          (incrs len   1)
          (incrs shift 7)
          (and v 128) )
        0 ;; this is really a do..while loop.
          ;; just put everything in the test, in a block
      )

      ;; HACK: data section global
      (i32_store _bytes len)
      i
    ]
  )}
)
