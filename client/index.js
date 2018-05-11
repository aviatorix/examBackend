var app = new Vue({
    el: '#app',
    data: {
        seen3: false,
        seen2: false,//mettere false appena finito
        seen: true,
        token: null,
        currentUser: '',
        friend: '',
        users: [],
        user: {
            name: '',
            surname: '',
            email: '',
            password: ''
        },
        email: '',
        password: '',
        text: '',
        privateChat: [],
        user1: '',
        user2: ''
    },
    methods: {
        login: function () {
            console.log("stiamo facendo il login");
            this.$http.post(`http://localhost:4000/account/login`, {
                email: this.email,
                password: this.password
            })
                .then(response => response.json())
                .then((response) => {
                    console.log("response:", response);
                    this.token = response.token;
                    console.log("Il token è " + this.token);
                    localStorage.setItem("token", this.token);
                    this.me();
                    this.email = '';
                    this.password = '';
                    this.seen = false;
                })
        },
        logout: function () {
            console.log(this.token);
            this.token = null;
            localStorage.removeItem("token");
            this.email = '';
            this.password = '';
        },

        signup: function () {
            this.$http.post(`http://localhost:4000/account/signup`, {
                name: this.user.name,
                surname: this.user.surname,
                email: this.user.email,
                password: this.user.password
            })
                .then(response => response.json())
                .then((response) => {
                    console.log("response:", response);
                    this.user.name = '';
                    this.user.surname = '';
                    this.user.email = '';
                    this.user.password = '';
                    console.log('utente registrato');

                })
        },
        db: function () {
            this.$http.get(`http://localhost:4000/account/allUser`)
                .then(response => response.json())//ecma script 6
                .then(response => {
                    this.users = response;
                    console.log("this.users " + this.users);
                });
        },
        me: function () {
            console.log("siamo loggati");
            this.$http.get(`http://localhost:4000/account/reallyMe?token=${this.token}`)
                .then(response => response.json())
                .then(response => {
                    console.log(response, response);
                    this.currentUser = response;
                });
        } 
    },
    created() {
        this.db();
        if (localStorage.getItem('token')) {
            console.log(localStorage.getItem('token'));
            var tokenUse = localStorage.getItem('token');
            this.$http.get(`http://localhost:4000/account/reallyMe?token=${tokenUse}`)
                .then(response => response.json())
                .then(response => {
                    this.currentUser = response;
                    this.seen = false;
                    console.log(this.currentUser);
                    //console.log(response, response.body);
                });
        }
    },
    watch: {
        'token': function (newValue, oldValue) {
            if (newValue !== null) {
                this.seen = false;
                localStorage.setItem('token', newValue);
            }
        }
    }
});