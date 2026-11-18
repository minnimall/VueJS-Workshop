<template>
    <div>
        <h1>API CONNECT</h1>
        <v-btn color="success" @click="newItem()">newItem</v-btn>
        <v-row>
            <v-col cols="3" v-for="(item, index) in apidata" :key="index"> <!-- การทำลูปข้อมูลในการนำมาแสดง แสดงพวก message และรูปภาพจากข้อมูลใน data --> 
                <div>
                    <v-card width="350">
                        <v-img src="https://www.lemon8-app.com/seo/image?item_id=7623935597077479954&index=2&sign=cc955d321d2ae59b7ee9e3bb9a95737b"></v-img>
                        <v-card-title primary-title>
                            {{ item.name }} {{ item.price }}
                        </v-card-title>
                        <v-card-actions>
                            <v-btn color="success" @click="editItem(item)">edit</v-btn>
                            <v-btn color="error" @click="deleteItem(item)">delete</v-btn>
                        </v-card-actions>
                    </v-card>
                </div>
            </v-col>
        </v-row>

        <v-dialog
            v-model="dialogedit"
            max-width="500px"
        >
            <v-card>
                <v-card-titie primary-title>
                    {{ savemode }}
                </v-card-titie>

                <v-card-text>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field name="name" label="name" id="name" v-model="postdata.name">
                        
                            </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field name="price" label="price" id="price" v-model="postdata.price">
                        
                            </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field name="stock" label="stock" id="stock" v-model="postdata.stock">
                        
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="closeItem">cancel</v-btn>
                    <v-btn color="info" text @click="saveSelect">save</v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import { API_BASE } from "../config";
export default {
    data() {
        return {
            apidata: [],
            id:'',
            postdata:{ // เอาไว้ส่งข้อมูล
                name:'',
                price:0,
                stock:0
            },
            postdefault:{ // ไว้เคลียร์ข้อมูล
                name:'',
                price:0,
                stock:0
            },
            dialogedit: false
        }
    },
    computed: { // ประมาลผล realtime จับค่า id ว่ามันเป็นค่าว่าไหม จะได้ส่งเพื่อสร้างใหม่ หรือ แก้ไช
        savemode (){
            return this.id === '' ? 'NewItem' : 'EditItem'
        }
    },
    created() { // กำหนดเมื่อเปิดเว็บมาให้ไปดึงข้อมูลของตัว getData() api ที่เขียนเอาไว้
        this.getData()
    },
    methods: {
        newItem() {
            this.id = ''
            this.postdata = {...this.postdefault} // ที่ต้องใช้ postdefault เพื่อให้ข้อมูลของ object ไม่ ref กัน ตัว ... คือทั้งหมด
            this.dialogedit = true
        },
        editItem(item) {
            this.id = item._id
            this.postdata = {...item} 
            this.dialogedit = true
        },
        closeItem() {
            this.id = ''
            this.postdata = {...this.postdefault}
            this.dialogedit = false
        },
        saveSelect() {
            if(this.id != '') {
                this.savePutdata()
            }else this.savePostdata()
        },
        getData() {
            this.axios.get(`${API_BASE}/api/v1/products`,{
                header:{
                    Authorization: `Bearer $token`
                }
            }).then((respone) => {  // api get ดึงข้อมูล products
                console.log(respone.data)
                this.apidata = respone.data.data
            })
        },
        async savePostdata () {
            try {
                const {data} = await this.axios.post(`${API_BASE}/api/v1/products`, this.postdata) // ตัว this.postdata คือตัวที่เราจะส่งมาทำการเพิ่มข้อมูล
                console.log(data)
                alert('Save product complete')
                this.getData()
                this.closeItem()
            } catch (error) {
                console.log(error)
                alert('error')
            }
        },
        async savePutdata () {
            try {
                const {data} = await this.axios.put(`${API_BASE}/api/v1/products/`+this.id, this.postdata) // ตัว this.postdata คือตัวที่เราจะส่งมาทำการเพิ่มข้อมูล
                console.log(data)
                alert('Update product complete')
                this.getData()
                this.closeItem()
            } catch (error) {
                console.log(error)
                alert('error')
            }
        },
        async deleteItem (item) {
            if(confirm('Delete '+item.name))
            try {
                const {data} = await this.axios.delete(`${API_BASE}/api/v1/products/`+item._id) // ตัว this.postdata คือตัวที่เราจะส่งมาทำการเพิ่มข้อมูล
                console.log(data)
                alert('Delete product complete')
                this.getData()
                this.closeItem()
            } catch (error) {
                console.log(error)
                alert('error')
            }
        }
    }
}
</script>

<style>

</style>