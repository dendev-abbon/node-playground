import { transactions } from "./data/index.js"
import { performance } from "perf_hooks"
import { generateReport } from "./util.js"

function binarySearch(target) {
  let low = 0
  let high = transactions.length - 1

  while (low <= high) {
    let mid = Math.floor((low + high) / 2)
    if (transactions[mid]?.id === target) {
      return mid
    } else if (transactions[mid]?.id < target) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return -1 // Target not found
}

function normalSearch(target) {
  for (let index = 0; index < transactions.length; index++) {
    if (transactions[index].id === target) {
      return index
    }
  }
  return -1 // Target not found
}

function buildinSearch(target) {
  return transactions.findIndex((t) => t.id === target)
}

const INPUT = 5000
console.clear()
console.info(`search with input: ${INPUT}`)

console.time("buildinSearch")
console.log(buildinSearch(INPUT))
console.timeEnd("buildinSearch")

console.time("normalSearch")
console.log(normalSearch(INPUT))
console.timeEnd("normalSearch")

console.time("binarySearch")
console.log(binarySearch(INPUT))
console.timeEnd("binarySearch")

/* ============= Report ============= */
function measureTime(fn, input) {
  const start = performance.now()
  fn(input)
  const end = performance.now()
  return end - start
}

const sizes = [100, 500, 1000, 5000, 10000, transactions.length] // Adjust sizes based on your data
const timesBinarySearch = []
const timesNormalSearch = []
const timesBuildinSearch = []

for (const size of sizes) {
  // Adjust data size based on `size`
  const sampleTransactions = transactions

  // Update functions to use sample data
  function binarySearchSample(target) {
    let low = 0
    let high = sampleTransactions.length - 1

    while (low <= high) {
      let mid = Math.floor((low + high) / 2)
      if (sampleTransactions[mid]?.id === target) {
        return mid
      } else if (sampleTransactions[mid]?.id < target) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    return -1 // Target not found
  }

  function normalSearchSample(target) {
    for (let index = 0; index < sampleTransactions.length; index++) {
      if (sampleTransactions[index].id === target) {
        return index
      }
    }
    return -1 // Target not found
  }

  function buildinSearchSample(target) {
    return sampleTransactions.findIndex((t) => t.id === target)
  }

  // Measure the performance for a target in the middle of the array
  const target = size //Math.floor(size / 2)

  timesBinarySearch.push(measureTime(binarySearchSample, target))
  timesNormalSearch.push(measureTime(normalSearchSample, target))
  timesBuildinSearch.push(measureTime(buildinSearchSample, target))
}

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Performance Comparison</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <canvas id="performanceChart" width="400" height="200"></canvas>
    <script>
        const sizes = ${JSON.stringify(sizes)};
        const timesBinarySearch = ${JSON.stringify(timesBinarySearch)};
        const timesNormalSearch = ${JSON.stringify(timesNormalSearch)};
        const timesBuildinSearch = ${JSON.stringify(timesBuildinSearch)};

        const ctx = document.getElementById('performanceChart').getContext('2d');
        const performanceChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: sizes,
            datasets: [
              {
                label: 'binarySearch',
                data: timesBinarySearch,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
              },
              {
                label: 'normalSearch',
                data: timesNormalSearch,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
              },
              {
                label: 'buildinSearch',
                data: timesBuildinSearch,
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
                  text: 'Search id',
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

generateReport("find", htmlContent)
