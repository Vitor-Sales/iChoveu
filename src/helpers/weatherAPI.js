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

export const getWeatherByCity = (/* cityURL */) => {
//   seu código aqui
};
