import { provinces, subdistricts, districts } from "./data/index.js"
import { performance } from "perf_hooks"
import { generateReport } from "./util.js"

function bubbleSort(arr = subdistricts) {
  const n = arr.length
  let swapped
  do {
    swapped = false
    for (let i = 0; i < n - 1; i++) {
      if (arr[i].label.th > arr[i + 1].label.th) {
        ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
        swapped = true
      }
    }
  } while (swapped)
  return arr
}

function selectionSort(arr = subdistricts) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j].label.th < arr[minIndex].label.th) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}

function insertionSort(arr = subdistricts) {
  const n = arr.length
  for (let i = 1; i < n; i++) {
    let key = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j].label.th > key.label.th) {
      arr[j + 1] = arr[j]
      j = j - 1
    }
    arr[j + 1] = key
  }
  return arr
}

function mergeSort(arr = subdistricts) {
  if (arr.length <= 1) {
    return arr
  }
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  return merge(left, right)

  function merge(left, right) {
    const result = []
    let leftIndex = 0
    let rightIndex = 0
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex].label.th < right[rightIndex].label.th) {
        result.push(left[leftIndex])
        leftIndex++
      } else {
        result.push(right[rightIndex])
        rightIndex++
      }
    }
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
  }
}

function quickSort(arr = subdistricts) {
  if (arr.length <= 1) {
    return arr
  }
  const pivot = arr[arr.length - 1]
  const left = []
  const right = []
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].label.th < pivot.label.th) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)]
}

function builtInSort(arr = subdistricts) {
  return arr.sort((a, b) => a.label.th.localeCompare(b.label.th))
}

console.clear()
// console.time("bubbleSort")
// const bubbleSortdData = bubbleSort([...subdistricts])
// console.timeEnd("bubbleSort")
// console.time("selectionSort")
// const selectionSortData = selectionSort([...subdistricts])
// console.timeEnd("selectionSort")
// console.time("insertionSort")
// const insertionSortData = insertionSort([...subdistricts])
// console.timeEnd("insertionSort")
// console.time("mergeSort")
// const mergeSortData = mergeSort([...subdistricts])
// console.timeEnd("mergeSort")
// console.time("quickSort")
// const quickSortData = quickSort([...subdistricts])
// console.timeEnd("quickSort")
// console.time("builtInSort")
// const builtInSortData = builtInSort([...subdistricts])
// console.timeEnd("builtInSort")

// Measure execution time of each sorting algorithm
function measureExecutionTime(sortFunction, data) {
  const startTime = performance.now()
  console.time(sortFunction.name)
  sortFunction(data)
  console.timeEnd(sortFunction.name)
  const endTime = performance.now()
  return endTime - startTime
}

// Execute and measure each sorting algorithm
const sortingAlgorithms = [
  { name: "Bubble Sort", func: bubbleSort },
  { name: "Selection Sort", func: selectionSort },
  { name: "Insertion Sort", func: insertionSort },
  { name: "Merge Sort", func: mergeSort },
  { name: "Quick Sort", func: quickSort },
  { name: "Built-in Sort", func: builtInSort },
]

const reportData = sortingAlgorithms.map(({ name, func }) => {
  const executionTime = measureExecutionTime(func, [...subdistricts])
  return { name, executionTime }
})

const chartLabels = reportData.map(({ name }) => name)
const chartData = reportData.map(({ executionTime }) => executionTime)

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sorting Algorithm Performance Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <h1>Data size: ${subdistricts.length}</h1>
  <canvas id="reportChart"></canvas>
  <script>
    const chartData = {
      labels: ${JSON.stringify(chartLabels)},
      datasets: [{
        label: 'Execution Time (ms)',
        data: ${JSON.stringify(chartData)},
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }]
    };
    
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Execution Time (ms)'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed.y.toFixed(2);
              return label;
            }
          }
        }
      }
    };
    
    const ctx = document.getElementById('reportChart').getContext('2d');
    const reportChart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  </script>
</body>
</html>
`

generateReport("sort", html)
