<template>
<div class="container">
    <app-header/>
    <div class="ui text container">
        <div class="ui basic padded segment">
            <div class="ui inverted dimmer" :class="{active : isLoading}">
                <div class="ui text loader">Loading</div>
            </div>
            <form class="ui huge form" @submit.prevent :class="notif.cls">
                <div class="field" :class="{error: $v.formData.username.$error}">
                    <input type="text" name="username" placeholder="Username"
                     v-model="formData.username" @blur="$v.formData.username.$touch()"
                     data-content="Minimal 6 karakter, maksimal 15 karakter, hanya angka dan huruf" 
                     data-position="top right"
                     data-variation="wide">
                </div>
                <div class="field" :class="{error: $v.formData.password.$error}">
                    <input type="password" name="password" placeholder="Password" 
                    v-model="formData.password" @blur="$v.formData.password.$touch()"
                    data-content="Minimal 8 karakter, maksimal 16 karakter" 
                    data-position="top right"
                    data-variation="wide">
                </div>
                
                <button class="ui big red button fluid" @click="login()">Login</button>
                <div v-if="notif.show" class="ui small message" :class="notif.cls">
                    <div class="header">{{ notif.header }}</div>
                    <p>{{ notif.message }} <router-link tag="a" to="/signUp" v-if="notif.cls=='error'">Register</router-link></p> 
                </div>

            </form>

        </div>
    </div>
</div>
</template>

<script>
import Header from '../header'
import { required, minLength, maxLength, alphaNum, email, sameAs } from 'vuelidate/lib/validators'
import dbAxios from '../../axios/dbAxios'

export default {
    mounted() {
      this.$nextTick(() => {
        $('input').popup()
      })
    },
    components: {
        appHeader : Header
    },
    data() {
        return {
            formData: {
                email:'',
                username:'',
                password:''
            },
            notif: {
                show:false,
                cls:'success',
                header:'aaa',
                message:'aaa'
            },
            isLoading: false
        }
    },
    validations : {
        formData : {
            username: { 
                required, 
                alphaNum, 
                minLength: minLength(6), 
                maxLength : maxLength(15)
            },
            password: { required, minLength: minLength (8), maxLength: maxLength(16) }
        }
    },
    methods: {
        login() {
            this.$v.$touch()
            if(this.$v.$invalid){
                this.setNotif("error","Form invalid", "Maaf, format data yang Anda masukkan salah.")
            }
            else {
                this.isLoading = true
                dbAxios.get('/users.json?orderBy="username"&equalTo="' + this.formData.username + '"')
                .then(res => {
                    this.formData.email = res.data[Object.keys(res.data)[0]].email
                    return this.$store.dispatch('login', this.formData)
                })
                .then(res=>{
                    return this.$store.dispatch('fetchUser')
                })
                .then(res=>{
                    this.isLoading = false
                    this.setNotif("success","Berhasil", "Anda sudah berhasil masuk")
                    return dbAxios.get('/preferredSellers.json?orderBy="username"&equalTo="' + this.$store.getters.user.username + '"')
                })
                .then(res => {
                    let notYetRegistered = Object.keys(res.data).length === 0
                    // if(notYetRegistered) this.$router.push('/penjualTerpilih/signUp')
                    // else window.location = "http://shopee.co.id"
                })
                .catch(error => {
                    console.log(error)
                    this.setNotif("error","Gagal", "Maaf, username dan password yang anda masukkan salah.")
                    this.isLoading = false
                })
                
            }
        },
        setNotif(cls,header, message) {
            this.notif.show = true
            this.notif.cls = cls
            this.notif.header = header
            this.notif.message = message
        }
    }
}
</script>

<style scoped>
    .text.container {
        padding-top:12vh !important
    }
    .button {
        margin-top:1em    
    }
</style>


