function splitAddress(address = "", fields = []) {
  const MAX = 30
  const MAX_FIELD = 2
  let rs = [""]
  const MAX_LENGTH = MAX * MAX_FIELD
  if (MAX_LENGTH < address.length) {
    throw new Error(`Data too long (${MAX_LENGTH})`)
  }

  const splited = (() => {
    if (address.length <= MAX) {
      return [address]
    }

    function splitMax() {
      rs = []
      for (let index = 0; index < MAX_FIELD; index++) {
        rs[index] = address.substring(index * MAX, (index + 1) * MAX)?.trim()
      }
      return rs
    }

    if (address.length === MAX_LENGTH) {
      return splitMax()
    }

    const parts = splitAdr(address) //address.split(" ");

    let i = 0

    for (let index = 0; index < parts.length; index++) {
      const part = parts[index]
      let current = rs[i] ?? ""

      if (current.length < MAX) {
        // console.warn(current, current.length)
        const newAdrs = `${current} ${part}`.trim()
        if (newAdrs.length > MAX) {
          current = part
          i++
        } else {
          current = newAdrs
        }
      } else {
        i++
        current = part
        // console.log(part, part.length)
      }

      rs[i] = current.trim()
    }

    if (rs.length > MAX_FIELD) {
      return splitMax()
    }

    return rs
    function splitAdr(adr = "") {
      const thaiWordPattern = /[ก-๙เ-ไๆ0-9/\-,.]+/g
      const englishWordPattern = /[a-zA-Z0-9/\-,.]+/g
      const addressPattern = new RegExp(`${thaiWordPattern.source}|${englishWordPattern.source}`, "g")

      const words = adr.match(addressPattern)
      return words
    }
  })()

  const obj = {}
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index]
    obj[field] = splited[index] ?? ""
  }
  return obj
}

const testData = [
  "17 หมู่ 3",
  "อาคารชุดกุหลาบเพลส1, เลขที่ 3/7, ชั้น 2, ซอย บางนาตราด 39",
  "อาคารชุดกุหลาบเพลส1, เลขที่ 3/7, ชั้น 2 ซอย บางนาตราด 39 ถนน",
  "อาคารชุดกุหลาบเพลส1, เลขที่ 3/7, ชั้น 2, ซอย บางนาตราด 39, ถนน บางนา-ตราด",
  "979/451 คอนโดฟิวเจอร์ริสทีค ซอยศิริชัย ถนนศิริพงษ์",
  "147/104 ซอยรามคำแหง 108",
  "78/1299 ซ.หมู่บ้านเขาน้อย, ถ.หัวหิน-หนองพลับ",
  "บ้านเลขที่ 123 หมู่ 5",
  "123 หมู่ 5 ถนนชุมชนวัดใหญ่",
  "789 ซอยสุขุมวิท 55",
  "456 หมู่ 3 ถนนลำพูน-ดอยสะเก็ด",
  "111/1 หมู่บ้านพฤกษา 10 ถนนปทุม-ลาดหลุมแก้ว",
  "55/2 ถนนนิพัทธ์สงเคราะห์ 1 ซอย 4",
  "99/9 หมู่ 2 ถนนมิตรภาพ",
  "678 หมู่ 8 ถนนเชียงราย-เชียงของ",
  "22/3 หมู่บ้านซิตี้ปาร์ค ถนนเอกชัย",
  "77/5 ซอยอ่อนนุช 46 ถนนอ่อนนุช",
  "334/1 ถนนมิตรภาพ ซอย 2",
  "88/88 หมู่ 6 ถนนบางกรวย-ไทรน้อย",
  "200/15 หมู่บ้านวรารมย์ ถนนสุโขทัย-ตาก",
  "333/12 ถนนประชาราษฎร์บำเพ็ญ",
  "5/1 หมู่ 9 ถนนอยุธยา-เสนา",
  "789/6 หมู่บ้านฟ้าปิยรมย์ ถนนลำลูกกา",
  "10/7 หมู่ 1 ถนนเพชรเกษม",
  "123/4 ซอยพหลโยธิน 32",
  "5/6 ถนนเลียบชายทะเล",
  "47/3 หมู่ 2 ถนนเขาค้อ-หล่มสัก",
  "88/9 หมู่ 7 ถนนเพชรเกษม",
  "15/4 หมู่ 4 ถนนลาดพร้าว",
  "198/22 ถนนงามวงศ์วาน",
  "56 หมู่ 9 ถนนเชียงใหม่-ลำปาง",
  "345/67 ถนนสรงประภา",
  "42/19 ถนนสาทร",
  "20/7 ถนนพระราม 2",
  "9/11 หมู่บ้านนวลจันทร์",
  "67/89 ถนนนวมินทร์",
  "32/18 หมู่บ้านบัวทอง",
  "14/5 หมู่บ้านปรีชา ถนนศรีนครินทร์",
  "123 หมู่ 5 ถนนชุมชนวัดใหญ่",
  "789 ซอยสุขุมวิท 55 แขวงคลองตันเหนือ",
  "456 หมู่ 3 ถนนลำพูน-ดอยสะเก็ด อำเภอเมือง",
  "111/1 หมู่บ้านพฤกษา 10 ตำบลบางคอแหลม",
  "55/2 ถนนนิพัทธ์สงเคราะห์ 1 ซอย 4",
  "99/9 หมู่ 2 ถนนมิตรภาพ ตำบลหนองสาหร่าย",
  "678 หมู่ 8 ถนนเชียงราย-เชียงของ ตำบลเวียง",
  "22/3 หมู่บ้านซิตี้ปาร์ค ซอย 3 ถนนเอกชัย",
  "77/5 ซอยอ่อนนุช 46 ถนนอ่อนนุช แขวงสวนหลวง",
  "334/1 ถนนมิตรภาพ ซอย 2 ตำบลในเมือง",
  "88/88 หมู่ 6 ถนนบางกรวย-ไทรน้อย ตำบลศาลากลาง",
  "200/15 หมู่บ้านวรารมย์ ซอย 7 ถนนสุโขทัย-ตาก",
  "333/12 ถนนประชาราษฎร์บำเพ็ญ ซอย 5",
  "5/1 หมู่ 9 ถนนอยุธยา-เสนา ตำบลนางาม",
  "789/6 หมู่บ้านฟ้าปิยรมย์ ถนนลำลูกกา",
  "10/7 หมู่ 1 ถนนเพชรเกษม ตำบลอ้อมใหญ่",
  "123/4 ซอยพหลโยธิน 32 แขวงจันทรเกษม",
  "5/6 ถนนเลียบชายทะเล ซอย 2 ตำบลแหลมฉบัง",
  "47/3 หมู่ 2 ถนนเขาค้อ-หล่มสัก ตำบลทุ่งสมอ",
  "88/9 หมู่ 7 ถนนเพชรเกษม ตำบลบางเตย",
  "15/4 หมู่ 4 ถนนลาดพร้าว",
  "198/22 ถนนงามวงศ์วาน",
  "56 หมู่ 9 ถนนเชียงใหม่-ลำปาง",
  "345/67 ถนนสรงประภา",
  "42/19 ถนนสาทร",
  "20/7 ถนนพระราม 2",
  "9/11 หมู่บ้านนวลจันทร์",
  "67/89 ถนนนวมินทร์",
  "32/18 หมู่บ้านบัวทอง",
  "14/5 หมู่บ้านปรีชา ถนนศรีนครินทร์",
  "123/456 Moo 7, Sukhumvit Road, Bangkok",
  "789 Soi Sukhumvit 55, Khlong Tan Nuea",
  "456 Moo 3, Lamphun-Doi Saket Road",
  "111/1 Pruksa 10 Village, Bang Kho Laem",
  "55/2 Niphat Songkhro 1 Road",
  "99/9 Moo 2, Mitr Phap Road",
  "678 Moo 8, Chiang Rai-Chiang Khong Road",
  "22/3 City Park Village, Ekachai Road",
  "77/5 Soi On Nut 46, On Nut Road",
  "334/1 Mittraphap Road",
  "88/88 Moo 6, Bang Kruai-Sai Noi Road",
  "200/15 Wararam Village, Sukhothai-Tak Road",
  "333/12 Pracharat Bamphen Road",
  "5/1 Moo 9, Ayutthaya-Sena Road",
  "789/6 Fa Piyarom Village, Lam Luk Ka Road",
  "10/7 Moo 1, Phetkasem Road",
  "123/4 Soi Phahon Yothin 32",
  "5/6 Coastal Road, Laem Chabang",
  "47/3 Moo 2, Khao Kho-Holm Sak",
  "88/9 Moo 7, Phetkasem Road",
]

testData.forEach((adr) => {
  try {
    console.info(adr, adr.length)
    console.log(splitAddress(adr, ["address1", "address2"]))
  } catch (error) {
    console.error(error.message)
  }
})

// testData.map(adr => {
//     console.info(adr, adr.length, );
//     console.log(splitAdr(adr))
// });
