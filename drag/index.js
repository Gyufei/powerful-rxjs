/* global rxjs */
const {
  fromEvent
} = rxjs

const {
  concatMapTo,
  takeUntil,
  withLatestFrom
} = rxjs.operators

const dragDom = document.getElementById('drag')
const body = document.body

const mouseDown = fromEvent(dragDom, 'mousedown')
const mouseMove = fromEvent(body, 'mousemove')
const mouseUp = fromEvent(body, 'mouseup')

mouseDown.pipe(
  concatMapTo(mouseMove.pipe(
    takeUntil(mouseUp)
  )),
  withLatestFrom(mouseDown, (mmove, mdown) => ({
    x: mmove.clientX - mdown.offsetX,
    y: mmove.clientY - mdown.offsetY
  })
  )
).subscribe(pos => {
  dragDom.style.transform = `translate(${pos.x}px, ${pos.y}px)`
})

document.body.addEventListener('mouseup', _ => console.log('up'))
document.body.addEventListener('mousedown', _ => console.log('down'))
