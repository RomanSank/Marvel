
class MarvelService {
  // начально название пути нашего API
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  // ключ нашего API
  _apiKey = 'apikey=5344f54a02afb71cecda017f39394805';

  _baseOffset = 210;


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
  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
    return res.data.results.map(this._transformCharacter);
  }

  // Метод получение одного персонажа из API 
  getCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    // передадим res в метод _transformCharacter для формирования объекта данных, который мы в дальнейшем будем использовать в приложении
    return this._transformCharacter(res.data.results[0]);
  }

  // Метод будет возвращать трансформированный объект
  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no information about this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }    
  }




}

export default MarvelService;