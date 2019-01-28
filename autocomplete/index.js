function getSuggestionList (word) {
  const url = `https://zh.wikipedia.org/w/api.php?action=opensearch&format=json&limit=5&origin=*&search=${word}`
  return fetch(url, {mode: 'cors', method: 'GET'}).then(res => res.json())
}

const inputDom = document.querySelector('#input')
const list = document.querySelector('#list')
const input$ = fromEvent(inputDom, 'input')
const select$ = fromEvent(list, 'click')

function parseResultToList (arr = []) {
  list.innerHTML = ''

  const fragment = document.createDocumentFragment()
  for (let item of arr) {
    const li = document.createElement('li')
    li.innerHTML = item
    fragment.appendChild(li)
  }

  list.appendChild(fragment)
}

input$.pipe(
  debounceTime(400),
  switchMap(e => {
    return getSuggestionList(e.target.value)
  }, (val, res) => res[1]  
)
).subscribe(
  arr => parseResultToList(arr)
)

select$.pipe(
  filter(e => e.target.matches('li')),
  map(e => e.target.innerText)
).subscribe(
  val => {
    inputDom.value = val
    parseResultToList([])
  }
)
