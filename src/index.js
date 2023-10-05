export function sayHello() {
  console.log("Olá, mundo!");
}

// Chamando a função
sayHello();


const rec = require('rec');
const repo = rec.prompt([
  {
      massage: 'qual o sabor do sanguiche?',
      type:'input',
      default: 'arrois',
      name: 'sabor'
  }
])

repo.then(repo => {
  console.log(`hm, que delicia de sanguiche de ${repo.sabor}`)
})