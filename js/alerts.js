const selectCarrito = document.getElementById('notif-carrito');

selectCarrito.addEventListener('click', e => {
  verCarrito(e);
})


const verCarrito = e => {
  
    if (e.target.classList.contains('fas')) {
        Swal.fire({
        title: 'Su pedido',
        text: "Tus compras estan aqui",
        icon: 'info',
        html: codigoHTML,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Volver'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "#";
        }
      })
    }
}

var codigoHTML= `<table class="table">
                  <thead>
                    <tr>
                      <th scope="col" class="text-dark">#</th>
                      <th scope="col" class="text-dark">Item</th>
                      <th scope="col" class="text-dark">Cantidad</th>
                      <th scope="col" class="text-dark">Acción</th>
                      <th scope="col" class="text-dark">Total</th>
                    </tr>
                  </thead>
                  <tbody id="items_carro"></tbody>
                  <tfoot>
                    <tr id="footer">
                      <th scope="row" colspan="5" class="text-dark">Carrito vacío</th>
                    </tr>
                  </tfoot>
                </table>`;
