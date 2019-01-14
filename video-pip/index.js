/* global rxjs */
const { fromEvent } = rxjs
const { map, filter, concatMapTo, takeUntil, withLatestFrom } = rxjs.operators

const anchor = document.querySelector('#video-offset-anchor')
const videoCon = document.querySelector('.video-container')

const scroll$ = fromEvent(document, 'scroll')
const mouseDown$ = fromEvent(videoCon, 'mousedown')
const mouseMove$ = fromEvent(document.body, 'mousemove')
const mouseUp$ = fromEvent(document.body, 'mouseup')

scroll$.pipe(
  map(_ => anchor.getBoundingClientRect().bottom < 0)
).subscribe(
  isOverTop => {
    if (isOverTop) {
      videoCon.classList.add('video-drag-container')
    } else {
      videoCon.classList.remove('video-drag-container')
    }
  }
)

mouseDown$.pipe(
  filter(e => e.target.classList.contains('video-drag-container')),
  concatMapTo(mouseMove$.pipe(
    takeUntil(mouseUp$)
  )),
  withLatestFrom(mouseDown$.pipe(
    map(mdown => ({
      rect: mdown.target.getBoundingClientRect(),
      offsetX: mdown.offsetX,
      offsetY: mdown.offsetY
    }))
  ), (mmove, mdown) => ({
    x: limitDragPos(mmove.clientX - mdown.offsetX, window.innerWidth - mdown.rect.width, 0),
    y: limitDragPos(mmove.clientY - mdown.offsetY, window.innerHeight - mdown.rect.height, 0)
  }))
).subscribe(pos => {
  videoCon.style.left = pos.x + 'px'
  videoCon.style.top = pos.y + 'px'
})

// 防止画中画超出当前窗口
function limitDragPos (val, max, min) {
  return Math.min(max, Math.max(val, min))
}
