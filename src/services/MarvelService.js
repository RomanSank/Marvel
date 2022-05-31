import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();

  // начально название пути нашего API
  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  // ключ нашего API
  const _apiKey = 'apikey=5344f54a02afb71cecda017f39394805';

  const _baseOffset = 210;
  const _limitChar = 'limit=9&';
  // characters?nameStartsWith=tho&apikey=5344f54a02afb71cecda017f39394805
  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
}


  // Метод получения всех персонажей
  const getAllCharacters = async (offset = _baseOffset, limit = _limitChar) => {
    const res = await request(`${_apiBase}characters?${limit}offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  }

  // Метод получение одного персонажа из API 
  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    // передадим res в метод _transformCharacter для формирования объекта данных, который мы в дальнейшем будем использовать в приложении
    return _transformCharacter(res.data.results[0]);
  }

  // Метод будет возвращать трансформированный объект
  const _transformCharacter = (char) => {
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

  const getAllComics = async (offset = 0) => {
    const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComics);
  }

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  }

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || 'There is no description',
      pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      language: comics.textObjects.language || 'en-us',
      price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
    }
  }

  return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic, getCharacterByName};


}

export default useMarvelService;