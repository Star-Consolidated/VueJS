<template>
    <v-layout align-start>

        <v-flex>
            <v-data-table :headers="headers" :items="desserts" :search="searchText" 
					sort-by="productoID" class="elevation-1" >
				<template v-slot:top>
					<v-toolbar flat color="white">
						<v-toolbar-title>Mi Carrito</v-toolbar-title>
						<v-divider class="mx-4" inset vertical ></v-divider>
						<v-spacer></v-spacer>
						<v-text-field class="text-xs-center" v-model="searchText" append-icon="search" 
							label="Search text" single-line hide-details > </v-text-field>
						<v-spacer></v-spacer>

						<v-dialog v-model="dialogConfirm" max-width="290">
							<v-card>
								<v-card-title class="headline">Delete Carrito?</v-card-title>
								<v-card-text>
									Would you like to delete this carrito?
									{{deletedItem.carritoID}} - {{deletedItem.cantidad}}
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="green darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
									<v-btn color="red darken-1" text @click="confimDelete()" > Delete </v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>

						<v-dialog v-model="dialogStudents" max-width="800px">
							<v-card>
								<v-card-title class="headline">Students de {{editedItem.name}}</v-card-title>
								<v-card-text>
									
									<template>
										<v-data-table
											:headers="headersStudents" :items="dessertsStudents" :items-per-page="5" class="elevation-1"
										></v-data-table>
									</template>

								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="dialogStudents = false">Close</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>

					</v-toolbar>
				</template>

				<template v-slot:item.action="{ item }">
					<v-icon color="green" class="mr-2" @click="viewStudents(item)" > people_alt </v-icon>
					<v-icon color="blue" class="mr-2" @click="editItem(item)" > edit </v-icon>
					<v-icon color="red" @click="deleteItem(item)" > delete </v-icon>
				</template>
				<template v-slot:no-data>
					<v-btn color="primary" @click="initialize">Reset</v-btn>
				</template>
			</v-data-table>
          
        </v-flex>
    </v-layout>


</template>

<script>
import axios from "axios";
export default {
    data: () => ({
		dialog: false,
		dialogConfirm: false,
		dialogStudents: false,
    	headers: [
			{ text: 'Producto Id', align: 'left', sortable: false, value: 'productoID' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Precio', value: 'precio' },
			{ text: 'Actions', value: 'action', sortable: false },
		],
		searchText: '',
		desserts: [],
		errors: [],
		editedIndex: -1,
		deletedIndex: -1,
		newItem: { nombre: '' },
		editedItem: { productoID: 0, nombre: '' },
		deletedItem: { productoID: 0, nombre: '' },
		responseItem: { productoID: 0, nombre: ''},
		defaultItem: { productoID: 0, nombre: '' },

		headersStudents: [			
			{ text: 'Id', align: 'left', sortable: false, value: 'id' },
			{ text: 'Producto', value: 'lastName' },
			{ text: 'Precio', value: 'firstMidName' },
		],
		dessertsStudents: [
			{id: 1, lastName: 'RicoCan', firstMidName: '10'},
			{id: 2, lastName: 'Crackitos', firstMidName: '10'},
			{id: 3, lastName: 'Hueso', firstMidName: '10'},
		],
  	}),

  	computed: {
    	formTitle () {
      		return this.editedIndex === -1 ? 'New Tienda' : 'Edit Tienda'
    	},
  	},

  	watch: {
    	dialog (val) {
      		val || this.close()
    	},
  	},

	created () {
		this.initialize()
	},

	methods: {
		initialize () {
			this.getProductos();
		},

		confimDelete () {
			this.deleteProducto( this.deletedItem.productoID );
			this.desserts.splice(this.deletedIndex, 1);
			this.dialogConfirm = false;
		},
		editItem (item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},
		deleteItem (item) {
			this.deletedIndex = this.desserts.indexOf(item);
			this.deletedItem = Object.assign({}, item);
			this.dialogConfirm = true;
		},
		viewStudents (item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogStudents = true;
		},

		close () {
			this.dialog = false;
			setTimeout(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			}, 300);
		},

		save () {
			// Edición
			if (this.editedIndex > -1) {
				this.putProducto( this.editedItem );
				Object.assign(this.desserts[this.editedIndex], this.editedItem)
			} else {
				// Nuevo
                this.newItem.nombre = this.editedItem.nombre;
                this.newItem.precio = this.editedItem.precio;
				// -
				this.postProducto(this.newItem);
				Object.assign( this.editedIndex, this.responseItem )
				this.getCarritos();
			}
			this.close();
		},

		getCarritos() {
			axios.get('https://localhost:5001/api/Productos')
				.then( response => {
					this.desserts = response.data;
				})
				.catch( error => {
					this.errors.push(error)
				})
		},
		postProducto(producto) {
			axios.post('https://localhost:5001/api/Productos', producto)
				.then( response => {
					this.responseItem = response.data;
				})
				.catch( error => {
					this.errors.push(error)
				});
		},
		putProducto(producto) {
			axios.put('https://localhost:5001/api/Productos/' + producto.productoID, producto)
				.then( response => { })
				.catch( error => {
					this.errors.push(error)
				});
		},
		deleteProducto(productoID) {
			axios.delete('https://localhost:5001/api/Productos/' + productoID)
				.then( response => { 
					this.responseItem = response.data;
				})
				.catch( error => {
					this.errors.push(error)
				});
		}
	},
}
</script>