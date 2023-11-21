const TOKEN = import.meta.env.VITE_TOKEN;

export const searchCities = async (term) => {
  const URL = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`;
  const arrayCities = await fetch(URL);
  const response = await arrayCities.json();
  if (response.length === 0) {
    window.alert('Nenhuma cidade encontrada');
    return [];
  }
  return response;
};

export const getWeatherByCity = async (cityURL) => {
  const URL = `http://api.weatherapi.com/v1/current.json?lang=pt&key=${TOKEN}&q=${cityURL}`;
  const response = await fetch(URL);
  const data = await response.json();
  const { name, country } = data.location;
  const { text, icon } = data.current.condition;
  return {
    temp: data.current.temp_c,
    condition: text,
    icon,
    country,
    name,
    url: cityURL,
  };
};

// getWeatherByCity('sao-paulo-sao-paulo-brazil');
