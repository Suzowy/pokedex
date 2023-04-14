const api_get_pokemon = `https://pokeapi.co/api/v2/pokemon`;
const api_get_imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;
const num_pokemon = 150;

const getPokemon = async () => {
  const response = await fetch(
    `${api_get_pokemon}?offset=0&limit=${num_pokemon}`
  );
  const responseToJson = await response.json();
  let todosPokemon = responseToJson.results;
  console.log(todosPokemon);


  const pintaPokemons = (pokemonLista = todosPokemon, imagenLista = []) => {
    const ul = document.querySelector(".listado");
    let ulContent = "";
    let cont = 0;
    pokemonLista.forEach((pokemon, index) => {
      cont++;
      const imagen = imagenLista[index];
      //he agregado los colores por tipo desde la clase de ayer
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
      const filtraPoke = buscaPokemon(todosPokemon, input.value);
      const fotos = await muestraImagen();
      const filtraImg = buscaImagen(fotos, filtraPoke);
      if (filtraPoke.length === 0) {
        //console.error(`El nombre del Pokemon ${input.value} no existe, vuelve a intentarlo`);
        // y he quitado el alert y agregado la imagen de pikachu triste cuando el nombre no existe
        const imagenError = document.createElement("img");
        imagenError.src = "giphy.gif";
        const ul = document.querySelector(".listado");
        ul.innerHTML = "";
        ul.appendChild(imagenError);
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

  const buscaImagen = (imagenLista, pokemonList) => {
    const filtraImg = [];
    pokemonList.forEach((pokemon) => {
      const index = todosPokemon.findIndex(
        (poke) => poke.name === pokemon.name
      );
      filtraImg.push(imagenLista[index]);
    });
    return filtraImg;
  };

  const fotos = await muestraImagen();
  pintaPokemons(todosPokemon, fotos);
  buscador();
};

getPokemon(); 