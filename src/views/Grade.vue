<template>
    <div>
        <h1>กรอกคะแนนตัดเกรด</h1>

        <v-text-field 
            label="กรอกคะแนน 0-100 " 
            v-model="score">
        </v-text-field>

        <v-btn color="success" @click="calGrade()">ยืนยัน</v-btn>

        <h1 v-if="grade !== ''">เกรด: {{ grade }}</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            score: '',
            grade: ''
        }
    },
    methods: {
        calGrade() {
            const num = Number(this.score)

            // ว่างเปล่า หรือ ไม่ใช่ตัวเลข หรือ อยู่นอกช่วง 0 - 100
            if (this.score === '' || isNaN(num) || num < 0 || num > 100) {
                this.grade = ''
                alert('กรอกตัวเลขในช่วง 0 - 100 เท่านั้น')
                return
            }

            if (num >= 80) {
                this.grade = 'A'
            } else if (num >= 70) {
                this.grade = 'B'
            } else if (num >= 60) {
                this.grade = 'C'
            } else if (num >= 50) {
                this.grade = 'D'
            } else {
                this.grade = 'F'
            }
        }
    }
}
</script>

<style>

</style>