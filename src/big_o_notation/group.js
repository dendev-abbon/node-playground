import { provinces, subdistricts, districts } from "./data/index.js"
import { performance } from "perf_hooks"
import { generateReport } from "./util.js"

function pureFilter(pvs = provinces) {
  return pvs.map((p) => {
    return {
      ...p,
      districts: districts
        .filter((d) => d.province_id.$oid == p._id.$oid)
        .map((d) => {
          return {
            ...d,
            subdistricts: subdistricts.filter(
              (sd) => sd.province_id.$oid === p._id.$oid && d._id.$oid === sd.district_id.$oid,
            ),
          }
        }),
    }
  })
}

function filterReduceSource(pvs = provinces) {
  let masterSubdistricts = subdistricts
  let masterDistricts = districts

  return pvs.map((p) => {
    const notMatchDistricts = []
    const province = {
      ...p,
      districts: [],
    }
    for (const d of masterDistricts) {
      if (d.province_id.$oid == p._id.$oid) {
        const notMatchSubdistricts = []
        const dis = {
          ...d,
          subdistricts: [],
        }

        for (const sd of masterSubdistricts) {
          if (sd.province_id.$oid === p._id.$oid && d._id.$oid === sd.district_id.$oid) {
            dis.subdistricts.push(sd)
          } else {
            notMatchSubdistricts.push(sd)
          }
        }
        // reduce loop in next district loop
        masterSubdistricts = notMatchSubdistricts

        province.districts.push(dis)
      } else {
        notMatchDistricts.push(d)
      }
    }

    masterDistricts = notMatchDistricts

    return province
  })
}

function mapGrouping(pvs = provinces) {
  const mapSubdistricts = subdistricts.reduce((map, sd) => {
    const key = `${sd.province_id.$oid}-${sd.district_id.$oid}`
    ;(map[key] ?? (map[key] = [])).push(sd)
    return map
  }, {})

  const mapDistricts = districts.reduce((map, d) => {
    ;(map[d.province_id.$oid] ?? (map[d.province_id.$oid] = [])).push({
      ...d,
      subdistricts: mapSubdistricts[`${d.province_id.$oid}-${d._id.$oid}`] ?? [],
    })
    return map
  }, {})

  return pvs.map((p) => {
    return {
      ...p,
      districts: mapDistricts[p._id.$oid] ?? [],
    }
  })
}
console.clear()

console.time("pureFilter")
const p1 = pureFilter()
console.timeEnd("pureFilter")

console.time("filterReduceSource")
const p2 = filterReduceSource()
console.timeEnd("filterReduceSource")

console.time("mapGrouping")
const p3 = mapGrouping()
console.timeEnd("mapGrouping")

// const sortProvince = (arr = p1) => {
//   return arr
//     .map((p) => {
//       p.districts = p.districts
//         .map((d) => {
//           d.subdistricts = d.subdistricts.sort((a, b) => a._id.$oid.localeCompare(b._id.$oid))
//           return d
//         })
//         .sort((a, b) => a._id.$oid.localeCompare(b._id.$oid))
//       return p
//     })
//     .sort((a, b) => a._id.$oid.localeCompare(b._id.$oid))
// }

const p1Str = JSON.stringify(p1)
const p2Str = JSON.stringify(p2)
const p3Str = JSON.stringify(p3)

console.log("p1 == p2", p1Str === p2Str)
console.log("p2 == p3", p2Str === p3Str)
console.log("p3 == p1", p1Str === p3Str)

/*
Summary:
pureFilter: O(P×D×S)
filterReduceSource: O(P×D×S)
mapGrouping: O(P+D+S)
Performance Comparison:
pureFilter and filterReduceSource have quadratic or cubic complexity depending on the relationship between P, D, and S, making them potentially very slow for large datasets.
mapGrouping has linear complexity, making it much more efficient for large datasets.
Therefore, mapGrouping is the most efficient solution in terms of time complexity.
*/

function measureTime(fn) {
  const start = performance.now()
  fn()
  const end = performance.now()
  return end - start
}

const timespureFilter = []
const timesfilterReduceSource = []
const timesmapGrouping = []

const sizes = [10, 20, 30, 40, 50, 60, provinces.length] // Adjust sizes as needed

for (const size of sizes) {
  // Adjust data size based on `size`
  const scaledProvinces = provinces.slice(0, size)

  timespureFilter.push(measureTime(() => pureFilter(scaledProvinces)))
  timesfilterReduceSource.push(measureTime(() => filterReduceSource(scaledProvinces)))
  timesmapGrouping.push(measureTime(() => mapGrouping(scaledProvinces)))
}

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Comparison</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <canvas id="performanceChart" width="400" height="200"></canvas>
    <script>
        const sizes = ${JSON.stringify(sizes)};
        const timespureFilter = ${JSON.stringify(timespureFilter)};
        const timesfilterReduceSource = ${JSON.stringify(timesfilterReduceSource)};
        const timesmapGrouping = ${JSON.stringify(timesmapGrouping)};

        const ctx = document.getElementById('performanceChart').getContext('2d');
        const performanceChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: sizes,
            datasets: [
              {
                label: 'Pure Filter',
                data: timespureFilter,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
              },
              {
                label: 'Filter Reduce Source',
                data: timesfilterReduceSource,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
              },
              {
                label: 'Map Grouping',
                data: timesmapGrouping,
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
generateReport("group", htmlContent)
