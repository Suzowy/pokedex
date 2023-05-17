const api_get_pokemon = `https://pokeapi.co/api/v2/pokemon`;
const api_get_imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`;

const num_pokemon = 150;

const getPokemon = async () => {
  const response = await fetch(`${api_get_pokemon}?offset=0&limit=${num_pokemon}`);
  const responseToJson = await response.json();
  let todosPokemon = responseToJson.results;

  const pintaPokemons = (pokemonLista = todosPokemon, imagenLista = []) => {
    const ul = document.querySelector(".listado");
    let ulContent = "";
    let cont = 0;
    pokemonLista.forEach((pokemon, index) => {
      cont++;
      const imagen = imagenLista[index];
      const tipo = imagen.tipo;
      const colorFondo =
        tipo === "grass"
          ? "#128512"
          : tipo === "fire"
          ? "#ff7801"
          : tipo === "water"
          ? "#6495ed "
          : tipo === "bug"
          ? "#f791c4"
          : tipo === "normal"
          ? "burlywood"
          : tipo === "poison"
          ? "#860c9e"
          : tipo === "electric"
          ? "yellow"
          : tipo === "ground"
          ? "#75351999"
          : tipo === "fairy"
          ? "fuchsia"
          : tipo === "rock"
          ? "grey"
          : tipo === "ghost"
          ? "white"
          : tipo === "fighting"
          ? "#0e7957"
          : tipo === "psychic"
          ? "silver"
          : tipo === "ice"
          ? "#80ebd6ec "
          : tipo === "dragon"
          ? "crimson"
          : tipo;
      ulContent += `<li>
                <h2>${pokemon.name}</h2>
                <img src="${imagen.url}">
                <p style="background-color: ${colorFondo};">${tipo}</p>
              </li>`;
    });
    ul.innerHTML = ulContent;
  };

  const buscador = async () => {
    const input = document.body.querySelector("input");
    input.addEventListener("input", async () => {
      borrarResultadoLucha();
      const filtraPoke = buscaPokemon(todosPokemon, input.value);
      const fotos = await muestraImagen();
      const filtraImg = buscaImagen(fotos, filtraPoke);
      if (filtraPoke.length === 0) {
       
        const imagenError = document.createElement("img");
        imagenError.src = "tumblr_lmwsamrrxT1qagx30.0.0.gif";
        imagenError.classList.add("error-image");
        const ul = document.querySelector(".listado");
        ul.innerHTML = "";
        ul.appendChild(imagenError);
         const textoError = document.createElement("h1");
        textoError.textContent = "Oh no... ese Pokémon no existe, prueba otra vez.";
        textoError.classList.add("error-text");
        ul.appendChild(textoError);
      } else {
        pintaPokemons(filtraPoke, filtraImg);
      }
    });
  };

  const filtraPorTipo = async (pokemonLista, tipo) => {
    if (tipo === "") {
      return pokemonLista;
    } else {
      const pokemonesFiltrados = await Promise.all(
        pokemonLista.map(async (pokemon) => {
          const pokemonDataResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonDataResponse.json();
          const tipoPokemon = pokemonData.types[0].type.name;
          return tipoPokemon === tipo ? pokemon : null;
        })
      );
      return pokemonesFiltrados.filter((pokemon) => pokemon !== null);
    }
  };

  const getRandomPokemon = () => {
    const index1 = Math.floor(Math.random() * todosPokemon.length);
    let index2 = Math.floor(Math.random() * todosPokemon.length);
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * todosPokemon.length);
    }
    return [todosPokemon[index1], todosPokemon[index2]];
  };
  
  const luchaPokemon = async () => {
    const [pokemon1, pokemon2] = getRandomPokemon();
    const response1 = await fetch(pokemon1.url);
    const response2 = await fetch(pokemon2.url);
    const pokemonData1 = await response1.json();
    const pokemonData2 = await response2.json();
  
    const nombre1 = pokemonData1.name;
    const nombre2 = pokemonData2.name;
  
    let vida1 = pokemonData1.stats[0].base_stat;
    let vida2 = pokemonData2.stats[0].base_stat;
  
    console.log(`¡Comienza la batalla entre ${nombre1} y ${nombre2}!`);
    document.getElementById("pokemon-img1").src = `${api_get_imagen}${pokemon1.url.split("/")[6]}.png`;
    document.getElementById("pokemon-img2").src = `${api_get_imagen}${pokemon2.url.split("/")[6]}.png`;
  
    const resultadoLuchaElement = document.getElementById("resultado-lucha");
    resultadoLuchaElement.innerHTML = '';
    while (vida1 > 0 && vida2 > 0) {
      const ataque1 = pokemonData1.moves[Math.floor(Math.random() * pokemonData1.moves.length)];
      const ataque2 = pokemonData2.moves[Math.floor(Math.random() * pokemonData2.moves.length)];
  
      const daño1 = ataque1.power;
      const daño2 = ataque2.power;
  
      vida2 -= daño1;
      vida1 -= daño2;
  
      const textoLucha = `${nombre1} usa ${ataque1.name} y causa ${daño1} de daño.<br>
                          ${nombre2} usa ${ataque2.name} y causa ${daño2} de daño.<br>
                          ${nombre1} tiene ${vida1} puntos de vida restantes.<br>
                          ${nombre2} tiene ${vida2} puntos de vida restantes.<br>`;
  
      console.log(textoLucha);
      resultadoLuchaElement.innerHTML += textoLucha;
    }
  
    if (vida1 <= 0 && vida2 <= 0) {
      const textoResultado = "¡Es un empate!";
      console.log(textoResultado);
      resultadoLuchaElement.innerHTML += textoResultado;
    } else if (vida1 <= 0) {
      const textoResultado = `${nombre2} es el ganador!`;
      console.log(textoResultado);
      resultadoLuchaElement.innerHTML += textoResultado;
    } else {
      const textoResultado = `${nombre1} es el ganador!`;
      console.log(textoResultado);
      resultadoLuchaElement.innerHTML += textoResultado;
    }
  };
  const borrarResultadoLucha = () => {
    const resultadoLuchaElement = document.getElementById("resultado-lucha");
    resultadoLuchaElement.innerHTML = '';
  };


  const buscaImagen = (imagenLista, pokemonList) => {
    const filtraImg = [];
    pokemonList.forEach((pokemon) => {
      const index = todosPokemon.findIndex((poke) => poke.name === pokemon.name);
      filtraImg.push(imagenLista[index]);
    });
    return filtraImg;
  };

  const muestraImagen = async () => {
    const fotos = await Promise.all(
      responseToJson.results.map(async (pokemon) => {
        const pokemonDataResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonDataResponse.json();
        const tipo = pokemonData.types[0].type.name;
        return {
          url: `${api_get_imagen}${pokemon.url.split("/")[6]}.png`,
          tipo: tipo,
        };
      })
    );
    return fotos;
  };

  const buscaPokemon = (pokemonLista, filtro) => {
    return pokemonLista.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const buscadorTipo = async () => {
    const select = document.getElementById("filtro-tipo");
    const btnBuscar = document.getElementById("btn-buscar");
   
    btnBuscar.addEventListener("click", async () => {
      const tipo = select.value;
      const pokemonesFiltrados = await filtraPorTipo(todosPokemon, tipo);
      const fotosFiltradas = buscaImagen(fotos, pokemonesFiltrados);
      pintaPokemons(pokemonesFiltrados, fotosFiltradas);
      borrarResultadoLucha();
    });
  };

  const fotos = await muestraImagen();
  pintaPokemons(todosPokemon, fotos);
  buscador();
  buscadorTipo();

  const btnLuchar = document.getElementById("btn-luchar");
  btnLuchar.addEventListener("click", () => {
   
    const pokemon1 = todosPokemon[0]; // Elige el primer Pokémon de la lista
    const pokemon2 = todosPokemon[1]; // Elige el segundo Pokémon de la lista
    luchaPokemon(pokemon1, pokemon2);
    borrarResultadoLucha();
  });
};

getPokemon();
