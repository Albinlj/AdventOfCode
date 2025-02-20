import { expect, test } from 'bun:test'
import { countBy } from 'lodash'
import { insert } from 'ramda'

const input = await Bun.file('day23.input.txt').text()

const example = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`

test('day20', () => {
  expect(part1(example)).toEqual(7)
  expect(part1(input)).toEqual(1423)

  expect(part2(example)).toEqual('co,de,ka,ta')
  expect(part2(input)).toEqual('gt,ha,ir,jn,jq,kb,lr,lt,nl,oj,pp,qh,vy')
})

const part1 = (input: string) => {
  const connections = input
    .trim()
    .split('\n')
    .map((line) => line.split('-'))

  const map: Map<string, string[]> = new Map()
  const add = (a: string, b: string) => {
    const thing = map.get(a)
    if (thing) {
      thing.push(b)
    } else {
      map.set(a, [b])
    }
  }

  for (const [a, b] of connections) {
    add(a, b)
    add(b, a)
  }

  let trios = new Set()

  for (const [a, bs] of map.entries()) {
    for (const b of bs) {
      const cs = map.get(b)!
      for (const c of cs) {
        const ds = map.get(c)!
        if (ds.includes(a)) {
          const trio = [a, b, c]
          if (trio.some((computer) => computer.startsWith('t'))) {
            trios.add(trio.sort().join(','))
          }
        }
      }
    }
  }

  return trios.size
}

const part2 = (input: string) => {
  const connections = input
    .trim()
    .split('\n')
    .map((line) => line.split('-'))

  const map: Map<string, Set<string>> = new Map()
  const add = (a: string, b: string) => {
    const thing = map.get(a)

    if (thing) {
      thing.add(b)
    } else {
      map.set(a, new Set([b]))
    }
  }
  for (const [a, b] of connections) {
    add(a, b)
    add(b, a)
  }

  let allGroups = new Set()

  const nodes = map.keys().toArray()
  for (const parent of nodes) {
    const neighs = map.get(parent)!
    let group = new Set([parent])
    for (const neigh of neighs) {
      const neighneighs = map.get(neigh)!
      if (group.isSubsetOf(neighneighs)) {
        group.add(neigh)
      } else {
        allGroups.add([...group].toSorted().join(','))
        group = new Set([parent])
      }
    }
  }

  return [...allGroups].toSorted((a, b) => b.length - a.length).at(0)
}
