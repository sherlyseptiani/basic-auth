<template>
<div class="wrapper">
    <app-header/>

    <div class="ui text container">
        <div class="ui inverted dimmer" :class="{active : isLoading}">
            <div class="ui text loader">Loading</div>
        </div>
        <div class="ui basic segment">Bergabunglah dalam program Penjual Terpilih Shopee! Isi form di bawah ini dan lampirkan foto diri beserta KTP</div>
        
        <div class="ui attached padded segment">
            <div class="ui teal header uppercase"> Langkah 1 </div>
        </div>
        <div class="ui attached padded segment">
            <form class="ui big form" @submit.prevent :class="notif.cls">
                <div class="inline field" :class="{error: $v.formData.noKTP.$error}">
                    <label>Masukkan No. KTP</label>
                    <input type="text" name="ktp" placeholder="No. KTP" maxLength=16
                    v-model="formData.noKTP" @blur="$v.formData.noKTP.$touch()"
                    data-content="Hanya angka, 16 digit no. KTP" 
                    data-position="top right">
                </div>
            </form>
        </div>
        <br/>

        <div class="ui attached padded segment">
            <div class="ui teal header uppercase"> Langkah 2 </div>
        </div>
        <div class="ui attached padded segment">
            <form class="ui big form" @submit.prevent :class="notif.cls">
                <p>Foto diri beserta KTP Anda.
                Nomor KTP dan wajah Anda harus terlihat jelas dalam foto.</p>
                <div class="ui two column grid center aligned">
                    <div class="column">
                        <div class="image-upload">
                            <label for="fotoWajah">
                                <img class="image-upload-img" src="../../assets/images/upload.png"/>
                            </label>
                            <input id="fotoWajah" type="file" @change="getURL($event)"/>
                            <div class="word-break">{{ formData.fotoWajah || "Tambahkan foto Anda" }}</div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="image-upload">
                            <label for="fotoKTP">
                                <img class="image-upload-img" src="../../assets/images/upload.png"/>
                            </label>
                            <input id="fotoKTP" type="file" @change="getURL($event)"/>
                            <div class="word-break">{{ formData.fotoKTP || "Tambahkan foto KTP Anda" }}</div>
                        </div>
                    </div>
    
                </div>
            </form>
        </div>
        <br/>
        
        <div class="ui padded segment">
            <form class="ui huge form" @submit.prevent :class="notif.cls">
                <div class="field" :class="{error: $v.formData.setuju.$error}">
                    <div class="ui checkbox">
                        <input type="checkbox" tabindex="0" v-model="formData.setuju">
                        <label>Saya setuju dengan <a href=""> Syarat dan Ketentuan </a> program Penjual Terpilih Shopee</label>
                    </div>
                </div>
            </form>
        </div>

        <div class="ui vertical basic segment">
            <button class="ui big red button fluid" @click="register()">Kirimkan</button>
        </div>


            

        <div v-if="notif.show" class="ui small message" :class="notif.cls">
            <div class="header">{{ notif.header }}</div>
            <p>{{ notif.message }}</p>
        </div>

    </div>

</div>
</template>

<script>
import Header from '../header'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'

export default {
    created() {
        if (!this.$store.getters.isAuthenticated) this.$router.replace('/signIn')
        this.$store.dispatch('fetchUser')
        
    },
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
                noKTP:'',
                fotoWajah:'',
                fotoKTP:'',
                setuju:false,
                email:''
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
            noKTP: { 
                required, 
                numeric, 
                minLength: minLength(16),
                maxLength: maxLength(16)
            },
            fotoWajah: { required },
            fotoKTP: { required },
            email : { required },
            setuju: {
                isTrue(val) {
                    return val
                }
            }
        }
    },
    methods: {
        register() {
            this.formData.email = this.$store.state.email
            this.$v.$touch()
            if(this.$v.$invalid){
                this.setNotif("error","Form invalid", "Data yang Anda masukkan salah")
            }
            else {
                console.log(this.formData)
                this.isLoading = true
                this.$store.dispatch('signUpPenjualTerpilih', this.formData)
                .then(res=>{
                    this.isLoading = false
                    this.setNotif("success","Terima kasih", "Anda sudah terdaftar sebagai Penjual Terpilih!")
                    setTimeout(function(){
                        window.location.href = "http://www.shopee.co.id";
                    }, 5000);

                })
                .catch(error => {
                    console.log(error)
                    this.setNotif("error","Gagal", "Maaf, request Anda gagal, silahkan coba lagi")
                })
                
            }
        },
        setNotif(cls,header, message) {
            this.notif.show = true
            this.notif.cls = cls
            this.notif.header = header
            this.notif.message = message
        },
        getURL(event) {
            if(!/(\.jpg|\.jpeg|\.png|\.gif)$/i.exec(event.target.value)) alert ("Please upload image file type")
            else if (event.target.id == "fotoWajah") this.formData.fotoWajah = event.target.value
            else if (event.target.id == "fotoKTP") this.formData.fotoKTP = event.target.value
        }
    }
}
</script>

<style scoped>
.wrapper {
    background-color: #f5f5f5;
    min-height:100vh
}

.text.container {
    margin:0px auto !important
}
.ui.checkbox>label {
    font-size:14px !important;
    line-height:20px !important
}

.image-upload-img {
    cursor:pointer;
}

.image-upload > input
{
    display: none;
}

.word-break {
    word-break: break-all;
}
</style>

