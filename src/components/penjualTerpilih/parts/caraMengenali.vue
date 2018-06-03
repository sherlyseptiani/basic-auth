<template>
  <div class="container">
    <div class="ui vertical very padded segment center aligned">
      <div class="ui red header">BAGAIMANA CARA MENGENALI PENJUAL TERPILIH SHOPEE?</div>

      <div class="text container header"> 
          Penjual Terpilih Shopee dapat dikenali dari
          badge <img src="../../../assets/images/badge.png"/> yang dapat kamu temukan di:
      </div>

      <div class="ui three column grid container">
        <div class="column">
          <div class="ui basic segment center aligned">
            <div class="ui image">
              <img src="../../../assets/images/badge_1.png"/>
            </div>
            <div>Detil No. KTP telah sukses diterima dan disetujui oleh Shopee</div>
          </div>
        </div>
        <div class="column">
          <div class="ui basic segment center aligned">
            <div class="ui image">
              <img src="../../../assets/images/badge_2.png"/>
            </div>
            <div>Mempunyai persentase chat dibalas: ≥80%</div>
          </div>
        </div>
        <div class="column">
          <div class="ui basic segment center aligned">
            <div class="ui image">
              <img src="../../../assets/images/badge_3.png"/>
            </div>
            <div>Mempunyai rating: ≥4.5</div>
          </div>
        </div>
      </div><!--grid-->
    </div>
  </div>
</template>

<style scoped>
  .text.container {
    margin-bottom:1vh;
  }

  .column {
    padding:0 !important
  }

  .button {
    margin-top:3vh;
  }

  .image {
      margin: 1.5vh 0vh 1.5vh 0vh;
  }

  .header {
      margin-right: 10vw;
      margin-left:10vw;
  }
</style>
