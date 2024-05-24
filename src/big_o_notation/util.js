import fs from "fs"
import path from "path"

export function generateReport(filename, htmlContent) {
  const reportFolder = path.resolve("./src/big_o_notation/report")
  if (!fs.existsSync(reportFolder)) {
    console.warn(`"report" folder not exist, creating "report"`)
    fs.mkdirSync(reportFolder)
    console.info(`"report" folder created`)
  }
  const outputPath = path.join(reportFolder, filename + ".html")
  fs.writeFileSync(outputPath, htmlContent, "utf8")
  console.log(`Report generated: ${outputPath}`)
}
