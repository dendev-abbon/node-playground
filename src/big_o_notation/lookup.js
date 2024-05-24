import { users, transactions } from "./data/index.js"
import { performance } from "perf_hooks"
import { generateReport } from "./util.js"

console.clear()

console.time("data1")
const data1 = transactions.map((t) => ({
  ...t,
  user: users.find((u) => u.id === t.user_id),
}))
console.timeEnd("data1")

console.time("data2")
const data2 = (() => {
  const mapUsers = {}
  for (const u of users) {
    mapUsers[u.id] = u
  }

  return transactions.map((t) => ({
    ...t,
    user: mapUsers[t.user_id],
  }))
})()
console.timeEnd("data2")

/*
Summary:
For data1, the time complexity is 
𝑂
(𝑚×𝑛)
O(m×n), where 
𝑚
m is the number of elements in transactions and 
𝑛
n is the number of elements in users.
For data2, the time complexity is 
𝑂(𝑛+𝑚)
O(n+m), where 
𝑛
n is the number of elements in users and 
𝑚
m is the number of elements in transactions.
*/

function measureTime(fn) {
  const start = performance.now()
  fn()
  const end = performance.now()
  return end - start
}

const sizes = [100, 500, 1000, 5000, 10000, transactions.length / 4, transactions.length / 2, transactions.length] // Adjust sizes based on your data
const timesData1 = []
const timesData2 = []

for (const size of sizes) {
  // Adjust data size based on `size`
  const sampleUsers = users.slice(0, size)
  const sampleTransactions = transactions.slice(0, size)

  // Update functions to use sample data
  function data1() {
    return sampleTransactions.map((t) => ({
      ...t,
      user: sampleUsers.find((u) => u.id === t.user_id),
    }))
  }

  function data2() {
    const mapUsers = {}
    for (const u of sampleUsers) {
      mapUsers[u.id] = u
    }

    return sampleTransactions.map((t) => ({
      ...t,
      user: mapUsers[t.user_id],
    }))
  }

  timesData1.push(measureTime(data1))
  timesData2.push(measureTime(data2))
}

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Transaction Performance Comparison</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <canvas id="performanceChart" width="400" height="200"></canvas>
    <script>
        const sizes = ${JSON.stringify(sizes)};
        const timesData1 = ${JSON.stringify(timesData1)};
        const timesData2 = ${JSON.stringify(timesData2)};

        const ctx = document.getElementById('performanceChart').getContext('2d');
        const performanceChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: sizes,
            datasets: [
              {
                label: 'data1 (map with find)',
                data: timesData1,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
              },
              {
                label: 'data2 (pre-map users)',
                data: timesData2,
                borderColor: 'rgba(54, 162, 235, 1)',
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
generateReport("lookup", htmlContent)
