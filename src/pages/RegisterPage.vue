<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4 mx-auto" style="margin-top: 5%;">
                <div class="container-fluid bg-light p-4">
                    <div class="row g-4">
                        <div class="col-md-12">
                            <h1 class="text-center">Register Page</h1>
                        </div>
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <form class="row g-3 needs-validation" @submit.prevent="registerNow" novalidate>
                                        <div class="col-md-12">
                                            <label for="name" class="form-label">Full Name</label>
                                            <input type="text" class="form-control" id="name" v-model="name" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="email" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="email" v-model="email"
                                                required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="pass" class="form-label">Password</label>
                                            <input type="password" class="form-control" id="pass" v-model="pass"
                                                required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="age" class="form-label">Age</label>
                                            <input type="number" class="form-control" id="age" v-model="age" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="nationality" class="form-label">Nationality</label>
                                            <input type="text" class="form-control" id="nationality" v-model="nationality" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="gender" class="form-label">Gender</label>
                                            <select v-model="gender" id="gender" class="form-control">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div class="col-12">
                                            <button class="btn btn-primary" type="submit" style="width: 100%;">Register</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RegisterPage',
    data() {
        return {
            name: '',
            email: '',
            pass: '',
            gender: '',
            nationality: '',
            age: ''
        }
    },
    methods: {
        async registerNow() {
            const checkResponse = await fetch(`http://localhost:3000/users?email=${this.email}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                alert('Email already exists');
                return;
            }

            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.name,
                    email: this.email,
                    pass: this.pass,
                    age: this.age,
                    nationality: this.nationality,
                    gender: this.gender
                })
            });

            if (response.ok) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('email', this.email);
                this.$router.push('/');
            } else {
                alert('Failed to register');
            }
        }
    }
}
</script>

<style></style>
