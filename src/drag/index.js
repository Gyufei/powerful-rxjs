/* global rxjs */
const { fromEvent } = rxjs
const { concatMapTo, takeUntil, withLatestFrom } = rxjs.operators 

const dragDom = document.getElementById('drag')

const mouseDown$ = fromEvent(dragDom, 'mousedown')
const mouseMove$ = fromEvent(document.body, 'mousemove')
const mouseUp$ = fromEvent(document.body, 'mouseup')

mouseDown$.pipe(
  concatMapTo(mouseMove$.pipe(
    takeUntil(mouseUp$)
  )),
  withLatestFrom(mouseDown$, (mmove, mdown) => ({
    x: mmove.clientX - mdown.offsetX,
    y: mmove.clientY - mdown.offsetY
  })
  )
).subscribe(pos => {
  dragDom.style.transform = `translate(${pos.x}px, ${pos.y}px)`
})
