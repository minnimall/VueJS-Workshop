<template>
    <div>
        <h1>Helllo World</h1>
        <h1>{{ name }}</h1> <!-- ส่วนข้อมูลที่ได้จาก data binding  result = Dullapah --> 
        <testprops :name="name" />

        <v-btn color="info" @click="callAlert()">alert</v-btn> <!-- เรียกใช้ methods -->

        <v-btn color="success" @click="show = !show">switch</v-btn>

        <div v-if="show"> <!-- v if กำหนดเงื่อนไขได้ -->
            <cardimg />
        </div>

        <!-- <div>
            <h1 v-for="(item,index) in items" :key="index">
                {{ item.message }}
            </h1>
        </div> -->

        <v-row>
            <v-col cols="3" v-for="(item, index) in items" :key="index"> <!-- การทำลูปข้อมูลในการนำมาแสดง แสดงพวก message และรูปภาพจากข้อมูลใน data --> 
                <div>
                    <v-card width="350">
                        <v-img :src="item.imglink"></v-img>
                        <v-card-title primary-title>
                            {{ item.message }}
                        </v-card-title>
                        <v-card-actions>
                            <v-btn color="secondary" @click="callAlertParams(item.message)">Click</v-btn> <!-- เรียกใช้ methods แบบมี params -->
                        </v-card-actions>
                    </v-card>
                </div>
            </v-col>

            <v-col cols="12"> 
                <h1>{{value1}}</h1> <!-- การนำ v-model มาใช้งาน -->
                <v-text-field 
                    name="value1"
                    label="กรอกรายละเอียดข้อมูล"
                    id="value1"
                    v-model="value1"
                ></v-text-field>
                <v-btn color="success" @click="setLocalStorage()">Set</v-btn> <!-- กดเพื่อ set ค่า -->
                <v-btn color="warning" @click="removeLocalStorage()">Remove</v-btn> <!-- กดเพื่อ remove ค่า -->
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {EventBus } from '@/EventBus' // import eventbus
import cardimg from '../components/CardImg.vue'
import testprops from '../components/TestProps.vue' // import component props
export default {
    components: {
        cardimg,
        testprops
    },
    data() { // Data Binding ที่เป็นนำข้อมูลใน data มาใช้ใส่ใน template
        return {
            value1: '', // กำหนด v-model
            name: 'Minn',
            show: false,
            items: [
                { message:'Foo', imglink:'https://i.pinimg.com/236x/64/6c/29/646c296db0a32445c92245e60a7fc38e.jpg'}, 
                { message:'Bar', imglink:'https://www.lemon8-app.com/seo/image?item_id=7623935597077479954&index=2&sign=cc955d321d2ae59b7ee9e3bb9a95737b' },
                { message:'ABC', imglink:'https://i.pinimg.com/236x/64/6c/29/646c296db0a32445c92245e60a7fc38e.jpg'}, 
                { message:'DEF', imglink:'https://www.lemon8-app.com/seo/image?item_id=7623935597077479954&index=2&sign=cc955d321d2ae59b7ee9e3bb9a95737b' },
                { message:'HIJ', imglink:'https://i.pinimg.com/236x/64/6c/29/646c296db0a32445c92245e60a7fc38e.jpg'}, 
            ]
        }
    },
    mounted() { // การเรียกใช้ eventbus
        EventBus.$on('CallAlertMain', this.callAlert)
    },
    beforeDestroy() { // ล้างค่า eventbus
        EventBus.$off('CallAlertMain', this.callAlert)
    },
    methods: {
        callAlert() { // สร้าง callAlert method
            alert('สวัสดีชาวโลก')
        },
        callAlertParams(item) {
            alert(item)
        },
        setLocalStorage() { // Set ค่าใน localStorage
            localStorage.setItem('User', this.value1)
            this.$cookies.set('User', this.value1, '60s') // ทำการ เก็บ cookies ของ User ทั้งหมด 60 วิ
        },
        removeLocalStorage() {  // Remove ค่าใน localStorage
            localStorage.removeItem('User')
        }
    }
}
</script>

<style>

</style>