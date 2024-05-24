import { performance } from "perf_hooks"
import { generateReport } from "./util.js"

function fibonacci(n) {
  if (n <= 1) {
    return n
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

function fibonacciCache(n, cache = {}) {
  if (n <= 1) {
    return n
  } else if (n in cache) {
    return cache[n]
  }
  return (cache[n] = fibonacciCache(n - 1, cache) + fibonacciCache(n - 2, cache))
}

/*
The time complexity of the Fibonacci function without using memoization (cache) is exponential, O(2^n), because the function makes two recursive calls for each call to calculate the Fibonacci number. As a result, the number of function calls grows exponentially with the input n.

With memoization (cache), the time complexity improves dramatically to O(n), linear time. This is because each Fibonacci number is computed only once, and subsequent calls retrieve the precomputed result from the cache. Therefore, the number of function calls grows linearly with the input n, as each Fibonacci number is calculated only once and stored in the cache for future use.
*/

const INPUT = 40
console.clear()
console.info(`fibonacci with input: ${INPUT}`)

console.time("fibonacci")
console.info("fibonacci", fibonacci(INPUT))
console.timeEnd("fibonacci")

console.time("fibonacciCache")
console.info("fibonacciCache", fibonacciCache(INPUT))
console.timeEnd("fibonacciCache")

function measureTime(fn, input) {
  const start = performance.now()
  fn(input)
  const end = performance.now()
  return end - start
}

const inputs = Array.from({ length: 40 }, (_, i) => i) // Generate inputs from 1 to 20
const timesFibonacci = []
const timesFibonacciCache = []

for (const input of inputs) {
  timesFibonacci.push(measureTime(fibonacci, input))
  timesFibonacciCache.push(measureTime(fibonacciCache, input))
}

const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fibonacci Performance Comparison</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
      <canvas id="performanceChart" width="400" height="200"></canvas>
      <script>
          const inputs = ${JSON.stringify(inputs)};
          const timesFibonacci = ${JSON.stringify(timesFibonacci)};
          const timesFibonacciCache = ${JSON.stringify(timesFibonacciCache)};
  
          const ctx = document.getElementById('performanceChart').getContext('2d');
          const performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: inputs,
              datasets: [
                {
                  label: 'No cache',
                  data: timesFibonacci,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                  fill: false,
                },
                {
                  label: 'With cache',
                  data: timesFibonacciCache,
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
                    text: 'Input Size',
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
generateReport("fibonacci", htmlContent)
