<template>
<div>
    <app-header/>

    <div class="ui vertical very padded basic segment center aligned">
      <div class="ui red header">APA ITU PENJUAL TERPILIH SHOPEE?</div>
      <div class="ui text container">Sebuah apresiasi untuk penjual yang aktif dan memiliki pelayanan pelanggan yang baik </div>
    </div>

    <kriteria/>
    <cara-mengenali/>
    <keuntungan/>

    <div class="ui very padded basic segment center aligned">
        <div class="ui labeled huge button" tabindex="0" @click="registerPreferredSeller()">
            <div class="ui red huge icon button">
                <i class="hand point up outline icon"></i>
            </div>
            <a class="ui basic red huge label uppercase spaced">
                Gabung sekarang &nbsp;
                <i class="caret right icon"></i>
            </a>
        </div>
        <div class="ui text container center aligned">Pendaftaran dan pengumuman Penjual Terpilih Shopee akan dilakukan setiap hari Jumat.</div>
    </div>

    
</div>
</template>

<script>
import header from './parts/header'
import kriteria from './parts/kriteria'
import caraMengenali from './parts/caraMengenali'
import keuntungan from './parts/keuntungan'
import dbAxios from '../../axios/dbAxios'

export default {
  components: {
      appHeader : header,
      kriteria,
      caraMengenali,
      keuntungan
  },
  created() {
      this.$store.dispatch('fetchUser')
  },
  methods: {
      registerPreferredSeller() {
          if(!this.$store.getters.isAuthenticated) this.$router.push('/signIn')
          else {
                dbAxios.get('/preferredSellers.json?orderBy="username"&equalTo="' + this.$store.getters.user.username + '"')
                .then(res => {
                    let notYetRegistered = Object.keys(res.data).length === 0
                    if(notYetRegistered) this.$router.push('/penjualTerpilih/signUp')
                    else window.location = "http://shopee.co.id"
                })

            
              
              
          }
      }
  }
}
</script>

<style scoped>
  .text.container {
      margin-top: 2vh;
      margin-bottom: 2vh;
  }
</style>



