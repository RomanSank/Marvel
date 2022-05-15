import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();

  // начально название пути нашего API
  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  // ключ нашего API
  const _apiKey = 'apikey=5344f54a02afb71cecda017f39394805';

  const _baseOffset = 210;



  // Метод получения всех персонажей
  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
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

  return {loading, error, clearError, getAllCharacters, getCharacter};


}

export default useMarvelService;