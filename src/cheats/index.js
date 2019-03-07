/* global rxjs, fetch */
const { fromEvent } = rxjs
const { windowCount, every, concatMap, filter } = rxjs.operators

const cheats = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight'
]

const key$ = fromEvent(document.body, 'keydown')

key$.pipe(
  windowCount(8, 1),
  concatMap(event$ => event$.pipe(
    every((event, idx) => cheats[idx] === event.code)
  )),
  filter(isCheatRight => isCheatRight)
).subscribe(showThirtyLifeText)


// 输入秘籍成功
function showThirtyLifeText() {
  const lifeTextSpan = document.querySelector('#life-text')
  const lifeNumSpan = document.querySelector('#life-num')

  lifeTextSpan.style.color = 'red'
  lifeNumSpan.innerHTML = ' 30 '
  lifeNumSpan.style.fontSize = '22px'
}
