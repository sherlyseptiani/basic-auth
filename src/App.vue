<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('tryAutoLogin')
  }
}
</script>


<style>
.uppercase {
    text-transform: uppercase !important
}

.spaced {
    letter-spacing:0.1em;
}
</style>