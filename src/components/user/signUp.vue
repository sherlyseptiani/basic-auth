<template>
<div class="container">
    <app-header/>
    <div class="ui text container">
        <div class="ui basic padded segment">
            <div class="ui inverted dimmer" :class="{active : isLoading}">
                <div class="ui text loader">Loading</div>
            </div>
            <form class="ui huge form" @submit.prevent :class="notif.cls">

                <div class="field" :class="{error: $v.formData.email.$error}">
                    <input type="text" name="email" placeholder="Email"
                    v-model="formData.email" @blur="$v.formData.email.$touch()"
                    data-content="Format email: contoh@contoh.com" 
                    data-position="top right">
                </div>
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
                <div class="field" :class="{error: $v.formData.konfirmasiPassword.$error}">
                    <input type="password" name="password" placeholder="Konfirmasi password"
                     v-model="formData.konfirmasiPassword" @blur="$v.formData.konfirmasiPassword.$touch()"
                     data-content="Konfirmasi password harus sama dengan password" 
                     data-position="top right"
                     data-variation="wide">
                </div>

                <button class="ui big red button fluid" @click="register()">Register</button>

                <div v-if="notif.show" class="ui small message" :class="notif.cls">
                    <div class="header">{{ notif.header }}</div>
                    <p>{{ notif.message }}</p>
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
                password:'',
                konfirmasiPassword:''
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
            email: { 
                required, 
                email, 
                unique: val => {
                    if (val === '') return true
                    return dbAxios.get('/users.json?orderBy="email"&equalTo="' + val + '"')
                        .then(res => {
                        return Object.keys(res.data).length === 0
                        })
                }
            },
            username: { 
                required, 
                alphaNum, 
                minLength: minLength(6), 
                maxLength : maxLength(15),
                unique: val => {
                    if (val === '') return true
                    return dbAxios.get('/users.json?orderBy="username"&equalTo="' + val + '"')
                        .then(res => {
                            return Object.keys(res.data).length === 0
                        })
                } 
            },
            password: { required, minLength: minLength (8), maxLength: maxLength(16) },
            konfirmasiPassword: { 
                sameAs: sameAs ('password') 
            }
        }
    },
    methods: {
        register() {
            this.$v.$touch()
            if(this.$v.$invalid){
                if(!this.$v.formData.username.unique) this.setNotif("error","Username sudah terdaftar", "Silahkan pilih username lain")
                else if(!this.$v.formData.email.unique) this.setNotif("error","Email sudah terdaftar", "Silahkan masukkan email lain atau login")
                else this.setNotif("error","Form invalid", "Data yang Anda masukkan salah")
            }
            else {
                this.isLoading = true
                this.$store.dispatch('signup', this.formData)
                .then(res=>{
                    this.isLoading = false
                    this.setNotif("success","Berhasil", "Anda sudah berhasil didaftarkan")
                    this.$router.replace('/penjualTerpilih/signUp')
                })
                .catch(error => {
                    console.log(error)
                    this.setNotif("error","Gagal", "Maaf, request Anda gagal, silahkan coba lagi")
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
</style>

