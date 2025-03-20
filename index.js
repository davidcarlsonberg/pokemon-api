const apiSearchUrl = 'https://meowing-bristle-alamosaurus.glitch.me/api/pokemon/search';
const stateEl = document.querySelector('#state');
const errorEl = document.querySelector('#error');

const fetchPokemon = async (query = '') => {
  stateEl.textContent = 'Loading...';
  const url = `${apiSearchUrl}/${query}`;

  try {
    const response = await fetch(url);
    console.log('response', response);

    if (!response.ok) {
      if (response.status === 404) stateEl.textContent = 'Empty results';
    }

    const data = await response.json();
    console.log('data', data);
    if (!data?.error) {
      errorEl.textContent = '';
    } else {
      errorEl.textContent = JSON.stringify(data);
    }

    if (data?.nextPage) {
      try {
        const nextResponse = await fetch(`${url}?page=${data.nextPage}`)
        console.log('nextResponse', nextResponse);
        const nextData = await nextResponse.json();
        console.log('nextData', nextData);
      } catch (nextError) {
        console.log(nextError);
      }
    }

    return data;
  } catch (error) {
    console.error('error', error);
    errorEl.textContent += error;
  }
}

const getAllPokemon = async query => await fetchPokemon(query);

const injectAllPokemon = async query => {
  const allPokemon = await getAllPokemon(query);

  if (allPokemon?.pokemon) {
    const ul = document.createElement('ul');

    allPokemon.pokemon.map(p => {
      const li = document.createElement('li');
      li.textContent = `${p.id} - ${p.name}`;
      ul.appendChild(li);
    })

    stateEl.textContent = 'Fetched results:';
    stateEl.appendChild(ul);
    // stateEl.textContent = `Fetched results: ${JSON.stringify(allPokemon.pokemon)}`;
  }
}

// define how to handle the input event
const handleInput = event => {
  console.log(event.target.value);
  injectAllPokemon(event.target.value);
}

// define the debounce method
const debounce = (callback, delay) => {
  let timeoutId;

  return (...arguments) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...arguments);
    }, delay);
  }
};

// define the debounced input handler
const debounceHandler = debounce(handleInput, 1000);

// grab the user input and attach the event listener
const inputEl = document.querySelector('#user-input');
inputEl.addEventListener('input', debounceHandler);
