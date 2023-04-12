const api_get_pokemon = `https://pokeapi.co/api/v2/pokemon`;
const api_get_imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;
const num_pokemon = 151;

const getPokemon = async () => {
    const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
    const responseToJson = await response.json();
    let todosPokemon = responseToJson.results;
    console.log(todosPokemon);

    const pintaPokemons = (pokemonLista = todosPokemon, imagenLista = []) => {
        const ul = document.querySelector('.listado');
        let ulContent = '';
        let cont = 0;
        pokemonLista.map(pokemon => {
            cont = ++cont;
            ulContent += `<li>
                    <h2>${pokemon.name}</h2>
                    <img src="${imagenLista[cont - 1]}">
                    </li>`;
        })
        ul.innerHTML = ulContent;
    }

    const muestraImagen = async () => {
        const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
        const responseToJson = await response.json();
        const fotos = responseToJson.results.map((pokemon) => `${api_get_imagen}${pokemon.url.split("/")[6]}.png`);
        return fotos;
    }

    const buscador = async () => {
        const input = document.body.querySelector("input");
        input.addEventListener("input", async () => {
            const filtraPoke = buscaPokemon(todosPokemon, input.value);
            const fotos = await muestraImagen();
            const filtraImg = buscaImagen(fotos, filtraPoke);
            if (filtraPoke.length === 0) {
                alert(`El nombre del Pokemon ${input.value} no existe, vuelve a intentarlo`);
            } else {
                pintaPokemons(filtraPoke, filtraImg);
            }
        });
    };

    const buscaPokemon = (pokemonLista, filtro) => {
        return pokemonLista.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(filtro.toLowerCase())
        );
    };

    const buscaImagen = (imagenLista, pokemonList) => {
        const filtraImg = [];
        pokemonList.forEach(pokemon => {
            const index = todosPokemon.findIndex(poke => poke.name === pokemon.name);
            filtraImg.push(imagenLista[index]);
        });
        return filtraImg;
    }

    const fotos = await muestraImagen();
    pintaPokemons(todosPokemon, fotos);
    buscador();
};

getPokemon();
