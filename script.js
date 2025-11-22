
const cats = [
  {
    id: 'gato-001',
    name: 'Luna',
    age: 'filhote',
    sex: 'Fêmea',
    color: 'Tigrada',
    behavior: 'calma, carinhosa',
    img: 'https://github.com/Spino91/adote-um-gato/blob/main/images/luna.jpg',
    description: 'Luna é brincalhona, se dá bem com crianças e está vermifugada.'
  },
  {
    id: 'gato-002',
    name: 'Oscar',
    age: 'adulto',
    sex: 'Macho',
    color: 'Branco e Preto',
    behavior: 'tímido, tranquilo',
    img: 'https://github.com/Spino91/adote-um-gato/blob/main/images/oscar.jpg',
    description: 'Oscar prefere ambientes tranquilos e precisa de um lar paciente.'
  },
  {
    id: 'gato-003',
    name: 'Theodoro',
    age: 'adulto',
    sex: 'Macho',
    color: 'Cinza',
    behavior: 'ativa, carinhosa',
    img: 'https://github.com/Spino91/adote-um-gato/blob/main/images/theodoro.jpg',
    description: 'Theo adora brincar com bolinhas e se dá bem com outros gatos.'
  },
  {
    id: 'gato-004',
    name: 'Tigrão',
    age: 'idoso',
    sex: 'Macho',
    color: 'Laranja',
    behavior: 'calmo, dorminhoco',
    img: 'https://github.com/Spino91/adote-um-gato/blob/main/images/tigrao.jpg',
    description: 'Tigrão é um senhorzinho tranquilo que adora colo.'
  }
];

const cardsContainer = document.getElementById('cards');
const filterSex = document.getElementById('filter-sex');
const filterAge = document.getElementById('filter-age');
const search = document.getElementById('search');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

function renderCards(list){
  cardsContainer.innerHTML = '';
  if (list.length === 0){
    cardsContainer.innerHTML = '<p>Nenhum gato encontrado com esses filtros.</p>';
    return;
  }
  list.forEach(cat => {
    const li = document.createElement('li');
    li.className = 'card';
    li.innerHTML = `
      <img src="${cat.img}" alt="Foto de ${cat.name}" />
      <div class="card-body">
        <h4>${cat.name}</h4>
        <p class="meta">${cat.age} • ${cat.sex} • ${cat.color}</p>
        <p>${cat.behavior}</p>
        <div class="actions">
          <button class="btn-ghost" data-id="${cat.id}" aria-haspopup="dialog">Ver ficha</button>
          <button class="btn-primary" data-interest="${cat.id}">Tenho interesse</button>
        </div>
      </div>
    `;
    cardsContainer.appendChild(li);
  });

  document.querySelectorAll('[data-id]').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.currentTarget.getAttribute('data-id');
      openModal(id);
    });
  });

  document.querySelectorAll('[data-interest]').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.currentTarget.getAttribute('data-interest');
      prefillContact(id);

      document.getElementById('contato').scrollIntoView({behavior:'smooth'});
    });
  });
}

function openModal(id){
  const item = cats.find(c => c.id === id);
  if (!item) return;
  modalBody.innerHTML = `
    <div style="display:flex;gap:1rem;flex-wrap:wrap;">
      <img src="${item.img}" alt="Foto de ${item.name}" style="width:240px;height:160px;object-fit:cover;border-radius:8px" />
      <div style="flex:1">
        <h3>${item.name}</h3>
        <p><strong>Idade:</strong> ${item.age}</p>
        <p><strong>Sexo:</strong> ${item.sex}</p>
        <p><strong>Cor:</strong> ${item.color}</p>
        <p>${item.description}</p>
        <p><strong>Comportamento:</strong> ${item.behavior}</p>
        <button class="btn-primary" id="modal-interest" data-id="${item.id}">Tenho interesse</button>
      </div>
    </div>
  `;
  modal.setAttribute('aria-hidden','false');
  modal.focus();
  document.getElementById('modal-interest').addEventListener('click', e => {
    prefillContact(e.currentTarget.getAttribute('data-id'));
    modal.setAttribute('aria-hidden','true');
    document.getElementById('contato').scrollIntoView({behavior:'smooth'});
  });
}

modalClose.addEventListener('click', () => {
  modal.setAttribute('aria-hidden','true');
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.setAttribute('aria-hidden','true');
});

function applyFilters(){
  const sex = filterSex.value;
  const age = filterAge.value;
  const q = search.value.trim().toLowerCase();
  let filtered = cats.filter(c => {
    if (sex !== 'all' && c.sex !== sex) return false;
    if (age !== 'all' && c.age !== age) return false;
    if (q){
      const hay = (c.name + ' ' + c.color + ' ' + c.behavior).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  renderCards(filtered);
}

filterSex.addEventListener('change', applyFilters);
filterAge.addEventListener('change', applyFilters);
search.addEventListener('input', () => {
  // small debounce
  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(applyFilters, 180);
});

const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

function prefillContact(id){
  const item = cats.find(c => c.id === id);
  if (!item) return;
  const msg = `Tenho interesse em adotar o gato "${item.name}" (ID: ${item.id}). Por favor, entrem em contato.`;
  document.getElementById('mensagem').value = msg;
  document.getElementById('nome').focus();
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  if (!nome || !email || !mensagem){
    feedback.hidden = false;
    feedback.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  feedback.hidden = false;
  feedback.textContent = 'Formulário enviado com sucesso! A ONG entrará em contato.';
  contactForm.reset();
});

renderCards(cats);
