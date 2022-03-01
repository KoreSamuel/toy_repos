#!/usr/bin/env zx
import 'zx/globals'

let flags = [
  '--oneline',
  '--decorate',
  '--color',
]
await $`git log ${flags}`

// await $`cat test.mjs`.pipe(process.stdout)
// let resp = await fetch('https://yesno.wtf/')
// if (resp.ok) {
//   console.log(await resp.text())
// }

let bear = await question('What kind of bear is best? ')
let token = await question('Choose env variable: ', {
  choices: ['A', 'B', 'C']
})
console.log(chalk.yellow(JSON.stringify({bear, token}, '', 2)))
