package handler

import (
	"io/ioutil"
  "fmt"
  "net/http"
	"encoding/json"
	"math"
)

type Country struct {
	Latlng []float64 `json:"latlng"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	url:= r.URL
	queries := url.Query()
	guess := queries["guess"][0]
	country := queries["country"][0]

	guess_country := <-Get_Country(guess, "name")
	daily_country := <-Get_Country(country, "alpha")

	distance, angle := Get_Distance(guess_country[0], guess_country[1], daily_country[0], daily_country[1])

	values := map[string]int{"distance": distance, "angle": angle }
	res, err := json.Marshal(values)
	if err != nil {
		fmt.Println("Unable to convert data to JSON")
	}
  fmt.Fprintf(w, string(res))
}

func Get_Country(country string, endpoint string) <-chan []float64 {
	arr := make(chan []float64)

	go func() {
		defer close(arr)
		res, err := http.Get("https://restcountries.com/v3.1/" + endpoint + "/" + country)

		if err != nil {
			fmt.Println("Err")
		}

		body, err := ioutil.ReadAll(res.Body)
		var country_data []Country
		json.Unmarshal(body, &country_data)
		arr <- country_data[0].Latlng
	}()

	return arr
}

// chat.openai.com was used to get this formula
// accompanying text:
// This function takes in the latitude and longitude of two points in degrees, converts them to radians, and then uses the haversine formula to calculate the distance between the points in kilometers.
// It also calculates the angle between the two points using the Atan2 function and converts the result from radians to degrees.
func Get_Distance(lat1 float64, lon1 float64, lat2 float64, lon2 float64) (int, int) {
    // convert to radians
    lat1Rad := lat1 * math.Pi / 180
    lon1Rad := lon1 * math.Pi / 180
    lat2Rad := lat2 * math.Pi / 180
    lon2Rad := lon2 * math.Pi / 180

    // calculate the distance using the haversine formula
    distance := 2 * math.Asin(math.Sqrt(math.Pow(math.Sin((lat1Rad-lat2Rad)/2), 2) +
        math.Cos(lat1Rad)*math.Cos(lat2Rad)*math.Pow(math.Sin((lon1Rad-lon2Rad)/2), 2))) * 6371 // Earth's radius in km

    // calculate the angle between the two points
    angle := math.Atan2(math.Sin(lon2Rad-lon1Rad)*math.Cos(lat2Rad), math.Cos(lat1Rad)*math.Sin(lat2Rad)-math.Sin(lat1Rad)*math.Cos(lat2Rad)*math.Cos(lon2Rad-lon1Rad)) * 180 / math.Pi

		return int(distance), int(angle)
}
