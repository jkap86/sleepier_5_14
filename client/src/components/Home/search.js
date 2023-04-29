import React, { useState, useEffect } from "react";
import { avatar } from '../Functions/misc';
import './css/search.css';

const Search = ({ id, sendSearched, placeholder, list, tab, isLoading }) => {
    const [searched, setSearched] = useState('')
    const [playerFound, setPlayerFound] = useState('')
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownOptions, setDropdownOptions] = useState([])

    useEffect(() => {
        handleSearch(searched)
    }, [searched])

    useEffect(() => {
        sendSearched(playerFound)
    }, [playerFound])

    useEffect(() => {
        setPlayerFound('')
        setSearched('')
    }, [tab])

    const handleSearch = (input) => {
        let s = input
        let options;
        let visible;

        if (s === '') {
            options = [];
            visible = false
            setPlayerFound(s)
        } else if (list.map(x => x.text?.trim().toLowerCase()).includes(s.trim().toLowerCase())) {
            const option = list.find(x => x.text?.trim().toLowerCase() === s.trim().toLowerCase())
            options = []
            visible = false
            setPlayerFound(option)
        } else {
            const all_options = list
            options = all_options.filter(x =>
                x.text?.trim().toLowerCase()
                    .replace("'", '')
                    .includes(s.trim().toLowerCase()))
            visible = true
        }
        setDropdownVisible(visible)
        setDropdownOptions(options)
    }

    return <>
        <div
            onBlur={() => setDropdownVisible(false)}
            className={'search_wrapper'}
        >
            {
                playerFound.image ?
                    avatar(playerFound.image.src, playerFound.image.alt, playerFound.image.type)
                    :
                    null
            }
            <input
                className={'search'}
                onChange={(e) => setSearched(e.target.value)}
                onFocus={() => setDropdownVisible(true)}

                id={id === undefined ? null : id}
                placeholder={placeholder}
                type="text"
                value={playerFound.text || searched}
                autoComplete={'off'}
                disabled={isLoading}
            />
            {
                searched === '' || !dropdownVisible && (searched !== '' && dropdownVisible) ?
                    <button
                        onClick={() => setSearched(' ')}
                        className={'input click'}
                    >
                        &#9660;
                    </button>
                    :
                    <button
                        type="reset"
                        onClick={() => setSearched('')}
                        className={'input click'}
                    >
                        X
                    </button>
            }
            {
                dropdownVisible && dropdownOptions.length > 0 && !isLoading ?
                    <ol
                        onBlur={() => setDropdownVisible(false)}
                        className="dropdown"
                    >
                        {dropdownOptions
                            .sort((a, b) => a.text > b.text ? 1 : -1)
                            .map((option, index) =>
                                <li key={`${option.text}_${index}`}>
                                    <button
                                        className="click"
                                        onMouseDown={() => setSearched(option.text)}
                                    >
                                        {
                                            option.image ?
                                                <p>
                                                    {
                                                        avatar(
                                                            option.image.src, option.image.alt, option.image.type
                                                        )
                                                    }
                                                    {option.text}
                                                </p>
                                                :
                                                option.text
                                        }
                                    </button>
                                </li>
                            )}
                    </ol>
                    :
                    null

            }
        </div>
    </>
}

export default Search;