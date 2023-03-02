import axios from "axios"
import Jimp from "jimp"

export default async function handler(req, res) {
  const { country, guess } = req.query
  const correctData = await axios.get(`https://restcountries.com/v3.1/alpha/${country}`)
  const correctFlagUrl = correctData.data?.[0]?.flags.png
  let countryFlag = await Jimp.read({
    url: correctFlagUrl
  })
  countryFlag = countryFlag.resize(1000, 1000)

  const guessData = await axios.get(`https://restcountries.com/v3.1/name/${guess}`)
  const guessFlagUrl = guessData.data?.[0]?.flags.png
  let guessFlag = await Jimp.read({
    url: guessFlagUrl
  })
  guessFlag= guessFlag.resize(1000, 1000)

  const distance = Jimp.distance(guessFlag, countryFlag)

  return res.send({ distance })
}
