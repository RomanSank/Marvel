import { Component } from 'react/cjs/react.production.min';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';




class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {      
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    // метод отслеживания загрузки данных для загрузки новых 9 персонажей
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    // методв записи в state данных о персонаже из API
    // пердадим loading: false чтобы убрать спиннер
    // при первом вызове метода пустой массив charList из state формируется массив из 9 объектор
    // при повторном вызове в charList добавятся новые элементы newCharList в уже существующий
    onCharListLoaded = (newCharList) => {
        // ended - если false, то данные для следующей загрузки данных есть
        // ended - если true, то данных больше нет и в render можно скрыть кнопку
        // проверяем есть сколько новых персонажей приходи из API. Если меньше 9, то меняем значение ended
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList}) => ({            
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended            
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    } 

    renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    //передадим наверх значаение id при клике в app.js
                    onClick={() => this.props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }   

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
    
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (            
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content} 
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )

    }    
}


export default CharList;