<template> <!-- ส่วนเรียกใช้ตัวของ components -->
  <HelloWorld />
</template>

<script> 
  import HelloWorld from '../components/HelloWorld' //ส่วนการนำเข้าของ components

  export default {
    name: 'Home',

     components: { //ส่วนประกาศตัวของ components
      HelloWorld,
    },
  }
</script>
