/*
const USER = 10000
const TRANSACTION = 100000

function generateUsers() {
  const arr = []
  for (let index = 0; index < USER; index++) {
    arr.push({
      id: index + 1,
      name: `User ${index + 1}`,
    })
  }
  return arr
}

function generateTransactions() {
  const arr = []
  for (let index = 0; index < TRANSACTION; index++) {
    arr.push({
      id: index + 1,
      name: `Transaction ${index + 1}`,
      user_id: (index % USER) + 1,
      price: Math.floor(Math.random() * 100000) + 1
    })
  }
  return arr
}

const users = generateUsers()
const transactions = generateTransactions()

console.log(users)
console.log(transactions)
*/
import users from "./data.user.json"  with { "type": "json" }
import transactions from "./data.transaction.json"  with { "type": "json" }
import provinces from "./province-v5.json"  with { "type": "json" }
import subdistricts from "./subdistrict-v5.json"  with { "type": "json" }
import districts from "./district-v5.json"  with { "type": "json" }

export { users, transactions, provinces, subdistricts, districts }
