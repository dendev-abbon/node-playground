import package_prices_on_shelf from "./data/heygoody.package_prices_on_shelf.json"   with { "type": "json" }
import packages_on_shelf from "./data/heygoody.packages_on_shelf.json"   with { "type": "json" }
import packages_import from "./data/heygoody.packages_import.json"   with { "type": "json" }
import package_prices_import from "./data/heygoody.package_prices_import.json"   with { "type": "json" }
import sales from "./data/heygoody.sales.json"   with { "type": "json" }

import ObjectId from "mongo-objectid"
import fs from "fs"
import path from "path"
;(async function execute() {
  const list = [
    ["packages_on_shelf", migratePackagesOnShelf],
    ["packages_import", migratePackagesImport],
    ["package_prices_import", migratePackagePricesImport],
    ["package_prices_on_shelf", migratePackagePricesOnShelf],
    ["sales", migrateSales],
  ]

  for (const [filename, getData] of list) {
    writeFile(sortObjectKeys(getData()), `${filename}.json`)
  }
})()

function migratePackagesOnShelf() {
  return packages_on_shelf.map((i) => {
    const { package_code, package_insurer_code, ...rest } = i
    return rest
  })
}

function migratePackagesImport() {
  return packages_import.map((d) => {
    const { package_insurer_code, ...rest } = d
    return rest
  })
}

function migratePackagePricesOnShelf() {
  const packageAgeMap = new Map()
  const packageInsurerCodeMap = new Map()
  const packageCodeMap = new Map()

  for (const doc of packages_on_shelf) {
    const packageId = doc._id.$oid

    let minAgeNormalized = Infinity
    let maxAgeNormalized = -Infinity
    let minAge = undefined
    let maxAge = undefined

    for (const coverageGroup of doc.coverages) {
      for (const coverage of coverageGroup.coverages) {
        const min = normalizeAge(coverage.age_min.value, coverage.age_min.unit)
        const max = normalizeAge(coverage.age_max.value, coverage.age_max.unit)

        if (min < minAgeNormalized) {
          minAgeNormalized = min
          minAge = coverage.age_min
        }

        if (max > maxAgeNormalized) {
          maxAgeNormalized = max
          maxAge = coverage.age_max
        }
      }
    }

    packageAgeMap.set(packageId, {
      age_min: minAge,
      age_max: maxAge,
    })

    packageInsurerCodeMap.set(packageId, doc.package_insurer_code)
    packageCodeMap.set(packageId, doc.package_code)
  }

  return package_prices_on_shelf.map((d) => {
    const packageId = d.package_id.$oid
    const { price_master_id, net_premium, stamp, gross_premium, vat, ...rest } = d
    return {
      ...rest,
      age_packages: [
        {
          _id: {
            $oid: new ObjectId().toString(),
          },
          age_min: packageAgeMap.get(packageId).age_min,
          age_max: packageAgeMap.get(packageId).age_max,
          gross_premium,
          net_premium,
          stamp,
          vat,
          package_insurer_code: packageInsurerCodeMap.get(packageId),
          package_code: packageCodeMap.get(packageId),
        },
      ],
    }
  })
}

function migratePackagePricesImport() {
  const packageAgeMap = new Map()
  const packageInsurerCodeMap = new Map()
  const packageCodeMap = new Map()

  for (const doc of packages_import) {
    const packageId = doc._id.$oid

    let minAgeNormalized = Infinity
    let maxAgeNormalized = -Infinity
    let minAge = undefined
    let maxAge = undefined

    for (const coverage of doc.coverages) {
      const min = normalizeAge(coverage.age_min.value, coverage.age_min.unit)
      const max = normalizeAge(coverage.age_max.value, coverage.age_max.unit)

      if (min < minAgeNormalized) {
        minAgeNormalized = min
        minAge = coverage.age_min
      }

      if (max > maxAgeNormalized) {
        maxAgeNormalized = max
        maxAge = coverage.age_max
      }
    }

    packageAgeMap.set(packageId, {
      age_min: minAge,
      age_max: maxAge,
    })

    packageInsurerCodeMap.set(packageId, doc.package_insurer_code)
    packageCodeMap.set(packageId, doc.package_code)
  }

  return package_prices_import.map((d) => {
    const packageId = d.package_id.$oid
    const { gross_premium, net_premium, stamp, vat, ...rest } = d
    return {
      ...rest,
      age_packages: [
        {
          _id: { $oid: new ObjectId().toString() },
          age_min: packageAgeMap.get(packageId).age_min,
          age_max: packageAgeMap.get(packageId).age_max,
          gross_premium,
          net_premium,
          stamp,
          vat,
          package_insurer_code: packageInsurerCodeMap.get(packageId),
          package_code: packageCodeMap.get(packageId),
        },
      ],
    }
  })
}

function migrateSales() {
  return sales.map((sale) => {
    const { package_insurer_code, ...rest } = sale
    return {
      ...rest,
      package_insurer_code: package_insurer_code ? [package_insurer_code] : [],
      created_by: "65ae882bb2db908bce629bdb",
      updated_by: "65ae882bb2db908bce629bdb",
    }
  })
}

function writeFile(obj, filename) {
  try {
    const dist = path.resolve("./src/heygoody/data/dist")
    if (!fs.existsSync(dist)) {
      console.warn(`"dist" folder not exist, creating "dist"`)
      fs.mkdirSync(dist)
      console.info(`"dist" folder created`)
    }

    const filePath = dist + "/" + filename
    console.info(`Writing content to ${filePath}`)
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2))
    console.info(`Write content to file successful`, filePath)
  } catch (error) {}
}

function sortObjectKeys(obj) {
  if (typeof obj !== "object" || obj == null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }

  const sortedObj = {}
  const sortedKeys = Object.keys(obj).sort()

  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys(obj[key])
  }
  return sortedObj
}

function normalizeAge(value, unit) {
  switch (unit.toLowerCase()) {
    case "y":
      return value * 12 * 30
    case "m":
      return value * 30
    case "d":
      return value
  }
}
