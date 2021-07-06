const cards = document.getElementById('cards');
const items_del_carrito = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment();
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content; //content es para acceder a todas las etiquetas que esta dentro de la etiqueta
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
	fetchData();
	if (localStorage.getItem('carrito')){
		carrito = JSON.parse(localStorage.getItem('carrito'));
		pintarCarrito();
	}
})

cards.addEventListener('click', e => {
	addCarrito(e); //el e nos sirve para capturar el elemento que queremos modificar
})

items.addEventListener('click', e => {
	btnVariar(e);
})

const fetchData = async () => {

	try {
		const res = await fetch('./api.json');
		const data = await res.json();
		//console.log(data);
		pintarCards(data)
	}catch (error){
		console.log(error);
	}
}

const pintarCards = data => {
	//console.log(data);
	data.forEach(producto => {
		templateCard.querySelector('h5').textContent = producto.title;
		templateCard.querySelector('p').textContent = producto.precio;
		templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl); //SetAttribute('', articolo) - introducir algo por el atributo 
		templateCard.querySelector('.btn-dark').dataset.id = producto.id; //dataset.id crea un campo data-id
		const clone = templateCard.cloneNode(true); //clonar la etiqueta templateCard
		fragment.appendChild(clone); //hacer fragment
	})
	cards.appendChild(fragment);
} 	

const addCarrito = e => { //Declarar funcion addCarrito
	//console.log(e.target);
	//console.log(e.target.classList.contains('btn-dark')) // classList es para que me muestre la lista de clases, contains() me dice si contiene ese atributo
	if (e.target.classList.contains('btn-dark')) {
		//console.log(e.target.parentElement);
		setCarrito(e.target.parentElement);
	}
	e.stopPropagation() //detener cualquier otro evento que se herede del contenedor padre
}

const setCarrito = objeto => {
	//console.log(objeto);
	const producto = {
		id: objeto.querySelector('.btn-dark').dataset.id,
		title: objeto.querySelector('h5').textContent,
		precio: objeto.querySelector('p').textContent,
		cantidad: 1
	}
	if (carrito.hasOwnProperty(producto.id)) { // hasOwnProperty(producto.id) indica si la propiedad se repite
		producto.cantidad = carrito[producto.id].cantidad + 1;
	}

	carrito[producto.id] = {...producto} //exprend operator ...producto adquirimos la informacion de producto y hacemos una copia
	pintarCarrito();
}

const pintarCarrito = () => {
	console.log(carrito);
	items.innerHTML = '';
	Object.values(carrito).forEach(producto => {

		templateCarrito.querySelector('th').textContent = producto.id;
		templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
		templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
		templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
		templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
		templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad;
		const clone = templateCarrito.cloneNode(true);
		fragment.appendChild(clone);
	})
		items.appendChild(fragment);

			pintarFooter()
	localStorage.setItem('carrito', JSON.stringify(carrito)); //guardar en local storage
		
}

const pintarFooter = () => {
	footer.innerHTML = ''
	if (Object.keys(carrito).length === 0) {
		return footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
	}
	const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad , 0)
	const nTotal = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + precio * cantidad, 0)
	/*console.log(nCantidad);
	console.log(nTotal);*/
	templateFooter.querySelector('td').textContent = nCantidad;
	templateFooter.querySelector('span').textContent = nTotal;

	const clone = templateFooter.cloneNode(true);
	fragment.appendChild(clone);
	footer.appendChild(fragment);

	const btnVaciar = document.getElementById('vaciar-carrito');
	btnVaciar.addEventListener('click', () =>{
		carrito = {};
		pintarCarrito();
	})
}

const btnVariar = e => {
	console.log(e.target.dataset.id);
	const product = carrito[e.target.dataset.id];
	const idBtn = e.target.dataset.id;
	if (e.target.classList.contains('btn-info')) {
		//console.log(carrito[e.target.dataset.id].cantidad)
		product.cantidad = product.cantidad + 1;
		carrito[e.target.dataset.id] = {...product}
		pintarCarrito();
	}
	if (e.target.classList.contains('btn-danger')) {
		product.cantidad--;
		if (product.cantidad === 0) {
			delete carrito[e.target.dataset.id]; //delete elimina solo el objeto que tiene ese indice.
		}
		pintarCarrito();
	}
	e.stopPropagation()
}