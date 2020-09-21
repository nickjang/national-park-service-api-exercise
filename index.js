const store = {
  state: '',
  parks: [],
  maxResults: 0,
  searched: false,
  key: 'GDPdJ6UJzpxEI2sutsLD9Cxn3m9NDmahY56Y5IiM'
};

let generateStateOptionsElements = function () {
  let states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

  return states.reduce((string, state) => string += `<option value="${state}">${state}</option>`, '');
};

let generateParkElements = function (parks) {
  return parks.reduce((string, park) =>
    string += `
      <li>
      <h3>${park.name}</h3>
      <p>${park.description}</p>
      <p>Visit the park's website: <a href="${park.site}">${park.name}</a></p>
      </li>`, '');
};

let generateResultsElementsString = function (parks) {
  let parkElements = generateParkElements(parks);
  return `<section class="js-results">
            <h2>National Parks in this state:</h2>
            <ul class="js-np-list">
                ${parkElements}
            </ul>
          </section>`;
};

let renderConstantForm = function () {
  $('select#state').html(generateStateOptionsElements);
};

let render = function () {
  let html = '';
  let parks = store.parks;

  if(store.searched) html = generateResultsElementsString(parks);

  $('.js-results').html(html);
};

let updateParks = function (data) {
  data.forEach(park => store.parks.push({ name: park.fullName, description: park.description, site: park.url }));
  render();
};

let getParks = function () {
  let state = store.state;
  let maxResults = store.maxResults;
  let key = store.key;
  let url = `https://developer.nps.gov/api/v1/parks?stateCode=${state}&limit=${maxResults}&api_key=${key}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(responseJSON => updateParks(responseJSON.data))
    .catch(error => console.log(error));
};

let updateSearchParams = function (state, maxResults) {
  store.state = state;
  store.maxResults = maxResults;
  store.searched = true;
};

let updateSearchAndResults = function (state, maxResults) {
  updateSearchParams(state, maxResults);
  getParks();
};

let reset = function () {
  store.state = '';
  store.parks = [];
  store.maxResults = 10;
  store.searched = false;
};

let handleStateSubmit = function () {
  $('main').on('click', '.js-state-button', event => {
    let state = '';
    let maxResults = '';
    event.preventDefault();
    reset();
    state = $('select[name="state"]').val();
    maxResults = $('input[name="max-results"]').val();
    updateSearchAndResults(state, maxResults);
  });
};

const main = function () {
  handleStateSubmit();
  renderConstantForm();
  render();
};

$(main);