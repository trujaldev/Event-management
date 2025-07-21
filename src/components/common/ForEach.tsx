import React from 'react'

interface ForEachProps<T> {
  of: T[]
  render: (el: T, index: number, array: T[]) => React.ReactNode
}

const ForEach = <T,>({ of, render }: ForEachProps<T>) => {
  return (
    <>
      {React.Children.toArray(
        of?.map((el, index, array) => render(el, index, array)),
      )}
    </>
  )
}

export default ForEach
