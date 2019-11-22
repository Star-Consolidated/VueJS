<template>
    <v-layout align-start>

        <v-flex>
            <v-data-table :headers="headers" :items="desserts" :search="searchText" 
					sort-by="tiendaID" class="elevation-1" >
				<template v-slot:top>
					<v-toolbar flat color="white">
						<v-toolbar-title>Tiendas</v-toolbar-title>
						<v-divider class="mx-4" inset vertical ></v-divider>
						<v-spacer></v-spacer>
						<v-text-field class="text-xs-center" v-model="searchText" append-icon="search" 
							label="Search text" single-line hide-details > </v-text-field>
						<v-spacer></v-spacer>
						
						<v-dialog v-model="dialog" max-width="500px">
							<template v-slot:activator="{ on }">
								<v-btn color="primary" dark class="mb-2" v-on="on">Nueva Tienda</v-btn>
							</template>
							<v-card>
								<v-card-title>
									<span class="headline">{{ formTitle }}</span>
								</v-card-title>
					
								<v-card-text>
									<v-container>
										<v-row>		
											<v-col cols="12" sm="6" md="4">
												<v-text-field v-model="editedItem.tiendaID" label="Tienda Id" readonly></v-text-field>
											</v-col>									
											<v-col cols="12" sm="6" md="4">
												<v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
											</v-col>
                                            <v-col cols="12" sm="6" md="4">
												<v-text-field v-model="editedItem.correo" label="Correo"></v-text-field>
											</v-col>
                                            <v-col cols="12" sm="6" md="4">
												<v-text-field v-model="editedItem.telefono" label="Telefono"></v-text-field>
											</v-col>
										</v-row>
									</v-container>
								</v-card-text>
					
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
									<v-btn color="green darken-1" text @click="save">Save</v-btn>
                                    <v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
						</v-dialog>

						<v-dialog v-model="dialogConfirm" max-width="290">
							<v-card>
								<v-card-title class="headline">Delete Tienda?</v-card-title>
								<v-card-text>
									Would you like to delete this tienda?
									{{deletedItem.tiendaID}} - {{deletedItem.nombre}}
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
			{ text: 'Tienda Id', align: 'left', sortable: false, value: 'tiendaID' },
            { text: 'Tienda Name', value: 'nombre' },
            { text: 'Correo', value: 'correo' },
            { text: 'Telefono de Contacto', value: 'telefono' },
			{ text: 'Actions', value: 'action', sortable: false },
		],
		searchText: '',
		desserts: [],
		errors: [],
		editedIndex: -1,
		deletedIndex: -1,
		newItem: { nombre: '' },
		editedItem: { tiendaID: 0, nombre: '' },
		deletedItem: { tiendaID: 0, nombre: '' },
		responseItem: { tiendaID: 0, nombre: ''},
		defaultItem: { tiendaID: 0, nombre: '' },

		headersStudents: [			
			{ text: 'Id', align: 'left', sortable: false, value: 'id' },
			{ text: 'Last Name', value: 'lastName' },
			{ text: 'First Middle Name', value: 'firstMidName' },
			{ text: 'Career Id', value: 'careerID' },
		],
		dessertsStudents: [
			{id: 1, lastName: 'Flores Moroco', firstMidName: 'Juan Antonio', careerID: 1},
			{id: 2, lastName: 'Flores Moroco', firstMidName: 'Juan Antonio', careerID: 1},
			{id: 3, lastName: 'Flores Moroco', firstMidName: 'Juan Antonio', careerID: 2},
			{id: 4, lastName: 'Flores Moroco', firstMidName: 'Juan Antonio', careerID: 2},
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
			this.getTiendas();
		},

		confimDelete () {
			this.deleteTienda( this.deletedItem.tiendaID );
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
				this.putTienda( this.editedItem );
				Object.assign(this.desserts[this.editedIndex], this.editedItem)
			} else {
				// Nuevo
                this.newItem.nombre = this.editedItem.nombre;
                this.newItem.correo = this.editedItem.correo;
                this.newItem.telefono = this.editedItem.telefono;
				// -
				this.postTienda(this.newItem);
				Object.assign( this.editedIndex, this.responseItem )
				this.getTiendas();
			}
			this.close();
		},

		getTiendas() {
			axios.get('https://localhost:5001/api/Tiendas')
				.then( response => {
					this.desserts = response.data;
				})
				.catch( error => {
					this.errors.push(error)
				})
		},
		postTienda(tienda) {
			axios.post('https://localhost:5001/api/Tiendas', tienda)
				.then( response => {
					this.responseItem = response.data;
				})
				.catch( error => {
					this.errors.push(error)
				});
		},
		putTienda(tienda) {
			axios.put('https://localhost:5001/api/Tienda/' + tienda.tiendaID, tienda)
				.then( response => { })
				.catch( error => {
					this.errors.push(error)
				});
		},
		deleteTienda(tiendaID) {
			axios.delete('https://localhost:5001/api/Tiendas/' + tiendaID)
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