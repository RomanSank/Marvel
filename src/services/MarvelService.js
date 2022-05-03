class MarvelService {
  // начально название пути нашего API
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  // ключ нашего API
  _apiKey = 'apikey=5344f54a02afb71cecda017f39394805';

  //создадим метод получения данных с сервера
  // .ok свойство интерфейса Response содержит логическое значение, указывающее, 
  // был ли ответ успешным (статус в диапазоне 200–299) или нет
  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }

    return await res.json();
  }

  // Метод получения всех персонажей
  getAllCharacters = () => {
    return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
  }

  // Метод получение одного персонажа
  getCharacter = (id) => {
    return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
  }
}

export default MarvelService;