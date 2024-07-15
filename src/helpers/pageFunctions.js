import { searchCities, getWeatherByCity } from './weatherAPI';

const TOKEN = import.meta.env.VITE_TOKEN;

/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });
  weekdayContainer.style.display = 'flex';
  weekdayContainer.style.flexWrap = 'wrap';
  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */

const buttonStyle = (button) => {
  button.style.backgroundColor = 'green';
  button.style.color = 'white';
  button.style.padding = '10px';
  button.style.marginBottom = '10px';
  button.style.border = '0 none';
  button.style.borderRadius = '5px';
  button.style.fontWeight = '600';
};

const addEvent = (btn, url) => {
  const URL = `http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${url}&days=7`;
  btn.addEventListener('click', async (event) => {
    event.preventDefault();
    const sevenDays = await fetch(URL);
    const response = await sevenDays.json();
    const data = await response.forecast.forecastday.map((day) => {
      return {
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
      };
    });
    showForecast(data);
  });
};

export function createCityElement(cityInfo) {
  const { name, country, temp, condition, icon, url } = cityInfo;

  const cityElement = createElement('li', 'city');

  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);

  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.appendChild(conditionElement);
  tempContainer.appendChild(tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const infoContainer = createElement('div', 'city-info-container');
  infoContainer.appendChild(tempContainer);
  infoContainer.appendChild(iconElement);

  const previewBtn = createElement('button', 'preview-btn', 'Ver previsão');

  cityElement.appendChild(headingElement);
  cityElement.appendChild(infoContainer);
  cityElement.appendChild(previewBtn);
  buttonStyle(previewBtn);
  addEvent(previewBtn, url);

  return cityElement;
}

const displayList = document.getElementById('cities');

export async function handleSearch(event) {
  event.preventDefault();
  clearChildrenById('cities');

  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value;
  const arrayCities = await searchCities(searchValue);
  Promise.all([
    arrayCities.forEach(async (city) => {
      const cityWeather = await getWeatherByCity(city.url);
      displayList.appendChild(createCityElement(cityWeather));
    }),
  ]);
  // newArrayCities
  //   .forEach((city) => displayList.appendChild(createCityElement(city)));
}
