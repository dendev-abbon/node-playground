import { users, transactions } from "./data/index.js"
import { performance } from "perf_hooks"
import { generateReport } from "./util.js"
const END = "0"
console.clear()

console.time("result1")
const result1 = transactions
  .filter((t) => t.name.endsWith(END))
  .map((t) => ({
    ...t,
    // user: users.find((u) => u.id === t.user_id),
  }))
console.timeEnd("result1")

console.time("result2")
const result2 = transactions
  .map((t) => ({
    ...t,
    // user: users.find((u) => u.id === t.user_id),
  }))
  .filter((t) => t.name.endsWith(END))

console.timeEnd("result2")

console.time("result3")
const result3 = (() => {
  const rs = []
  for (const t of transactions) {
    if (t.name.endsWith(END)) {
      rs.push({
        ...t,
        // user: users.find((u) => u.id === t.user_id),
      })
    }
  }
  return rs
})()

console.timeEnd("result3")

function measureTime(fn) {
  const start = performance.now()
  fn()
  const end = performance.now()
  return end - start
}

const sizes = [100, 500, 1000, 5000, 10000, transactions.length / 4, transactions.length / 2, transactions.length] // Adjust sizes based on your data
const timesResult1 = []
const timesResult2 = []
const timesResult3 = []

for (const size of sizes) {
  // Adjust data size based on `size`
  const sampleTransactions = transactions.slice(0, size)

  // Update functions to use sample data
  function result1() {
    return sampleTransactions
      .filter((t) => t.name.endsWith(END))
      .map((t) => ({
        ...t,
        // user: users.find((u) => u.id === t.user_id),
      }))
  }

  function result2() {
    return sampleTransactions
      .map((t) => ({
        ...t,
        // user: users.find((u) => u.id === t.user_id),
      }))
      .filter((t) => t.name.endsWith(END))
  }

  function result3() {
    const rs = []
    for (const t of sampleTransactions) {
      t.name.endsWith(END) &&
        rs.push({
          ...t,
          // user: users.find((u) => u.id === t.user_id),
        })
    }
    return rs
  }

  timesResult1.push(measureTime(result1))
  timesResult2.push(measureTime(result2))
  timesResult3.push(measureTime(result3))
}

const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Filter and Map Performance Comparison</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
      <canvas id="performanceChart" width="400" height="200"></canvas>
      <script>
          const sizes = ${JSON.stringify(sizes)};
          const timesResult1 = ${JSON.stringify(timesResult1)};
          const timesResult2 = ${JSON.stringify(timesResult2)};
          const timesResult3 = ${JSON.stringify(timesResult3)};
  
          const ctx = document.getElementById('performanceChart').getContext('2d');
          const performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: sizes,
              datasets: [
                {
                  label: 'result1 (filter -> map)',
                  data: timesResult1,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                  fill: false,
                },
                {
                  label: 'result2 (map -> filter)',
                  data: timesResult2,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                  fill: false,
                },
                {
                  label: 'result3 (for loop)',
                  data: timesResult3,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  fill: false,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Size of Input Data',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Execution Time (ms)',
                  },
                },
              },
            },
          });
      </script>
  </body>
  </html>
  `

// Write the HTML content to a file
generateReport("chaining_function", htmlContent)
