/* global rxjs */
const { fromEvent } = rxjs
const { map, delay } = rxjs.operators

const imgArr = document.getElementsByTagName('img')
const mouseMove$ = fromEvent(document.body, 'mousemove')

function drag (img, index) {
  mouseMove$.pipe(
    map(e => ({ x: e.clientX, y: e.clientY })),
    delay(index * 100)
  ).subscribe(pos => {
    img.style.transform = `translate(${pos.x}px, ${pos.y}px)`
  })
}

[].forEach.call(imgArr, drag)
