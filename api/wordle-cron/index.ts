import { createClient } from '@supabase/supabase-js'
// import type Country from './countries'
// import { borders } from './countries'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { config } from 'dotenv'

config()

const country = {"name":"Afghanistan","topLevelDomain":[".af"],"alpha2Code":"AF","alpha3Code":"AFG","callingCodes":["93"],"capital":"Kabul","altSpellings":["AF","Afġānistān"],"subregion":"Southern Asia","region":"Asia","population":40218234,"latlng":[33.0,65.0],"demonym":"Afghan","area":652230.0,"timezones":["UTC+04:30"],"borders":["IRN","PAK","TKM","UZB","TJK","CHN"],"nativeName":"افغانستان","numericCode":"004","flags":{"svg":"https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg","png":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png"},"currencies":[{"code":"AFN","name":"Afghan afghani","symbol":"؋"}],"languages":[{"iso639_1":"ps","iso639_2":"pus","name":"Pashto","nativeName":"پښتو"},{"iso639_1":"uz","iso639_2":"uzb","name":"Uzbek","nativeName":"Oʻzbek"},{"iso639_1":"tk","iso639_2":"tuk","name":"Turkmen","nativeName":"Türkmen"}],"translations":{"br":"Afghanistan","pt":"Afeganistão","nl":"Afghanistan","hr":"Afganistan","fa":"افغانستان","de":"Afghanistan","es":"Afganistán","fr":"Afghanistan","ja":"アフガニスタン","it":"Afghanistan","hu":"Afganisztán"},"flag":"https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg","regionalBlocs":[{"acronym":"SAARC","name":"South Asian Association for Regional Cooperation"}],"cioc":"AFG","independent":true} as const
const borders = ['co', 'ht', 'mq', 'si', 'ad', 'cr', 'hu', 'mr', 'sj', 'ae', 'cu', 'id', 'ms', 'sk', 'af', 'cv', 'ie', 'mt', 'sl', 'ag', 'cw', 'il', 'mu', 'sm', 'ai', 'cx', 'im', 'mv', 'sn', 'al', 'cy', 'in', 'mw', 'so', 'am', 'cz', 'mx', 'sr', 'ao', 'de', 'io', 'my', 'ss', 'aq', 'dj', 'iq', 'mz', 'st', 'ar', 'dk', 'ir', 'na', 'sv', 'as', 'dm', 'is', 'nc', 'sx', 'at', 'do', 'it', 'ne', 'sy', 'au', 'dz', 'jm', 'nf', 'sz', 'aw', 'ec', 'jo', 'ng', 'tc', 'ax', 'ee', 'jp', 'ni', 'td', 'az', 'eg', 'ke', 'nl', 'tf', 'ba', 'eh', 'kg', 'no', 'tg', 'bb', 'er', 'kh', 'np', 'th', 'bd', 'es', 'ki', 'nr', 'tj', 'be', 'et', 'km', 'nu', 'tk', 'bf', 'fi', 'kn', 'nz', 'tl', 'bg', 'fj', 'kp', 'om', 'tm', 'bh', 'fk', 'kr', 'pa', 'tn', 'bi', 'fo', 'kw', 'pe', 'to', 'bj', 'fr', 'ky', 'pf', 'tr', 'bl', 'ga', 'kz', 'pg', 'tt', 'bm', 'gb', 'la', 'ph', 'tw', 'bn', 'gd', 'lb', 'pk', 'tz', 'bo', 'ge', 'lc', 'pl', 'ua', 'bq', 'gf', 'li', 'pm', 'ug', 'br', 'gg', 'lk', 'pn', 'us', 'bs', 'gh', 'lr', 'pr', 'uy', 'bt', 'gi', 'ls', 'pt', 'uz', 'bv', 'gl', 'lt', 'pw', 'va', 'bw', 'gm', 'lu', 'py', 'vc', 'by', 'gn', 'lv', 'qa', 've', 'bz', 'gp', 'ly', 're', 'vg', 'ca', 'gq', 'ma', 'ro', 'vi', 'cc', 'gr', 'mc', 'rs', 'vn', 'cd', 'gs', 'md', 'ru', 'vu', 'cf', 'gt', 'me', 'rw', 'wf', 'cg', 'gu', 'mf', 'sa', 'ws', 'ch', 'gw', 'mg', 'sb', 'ye', 'ci', 'gy', 'mk', 'sc', 'yt', 'ck', 'hk', 'ml', 'sd', 'za', 'cl', 'hm', 'mm', 'se', 'zm', 'cm', 'hn', 'mn', 'sg', 'zw', 'cn', 'hr', 'mo', 'sh']

type Country = typeof country

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = 'https://qlwvctuttygmywyljfaj.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY

  const supabase = createClient(supabaseUrl, supabaseKey || '')

  const country = await getValidCounty()

  const EM = '-'
  const today = new Date()
  const currentDate = `${today.getFullYear()}${EM}${String(today.getMonth() + 1).padStart(2, '0')}${EM}${String(today.getDate()).padStart(2, '0')}`
  await supabase.from('dailyworldles').insert({ date: currentDate, country: country?.alpha2Code?.toLowerCase() })

  res.status(200).end('Hello Cron!');
}

async function getValidCounty(): Promise<Country> {
  let country: Country = {} as Country
  let validCountry = false
  while (!validCountry) {
    const req = await fetch("https://restcountries.com/v3.1/all")
    const data = await req.json()
    country = data[Math.floor(Math.random() * data.length)]
    if (country && borders.find((border) => border === country.alpha2Code?.toLowerCase())) validCountry = true
  }
  return country
}
