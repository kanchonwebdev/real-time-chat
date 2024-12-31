<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 mx-auto" style="margin-top: 12%;">
                <div class="container-fluid bg-light p-4">
                    <div class="row g-4">
                        <div class="col-md-12">
                            <h1 class="text-center">Login Page</h1>
                        </div>
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <form class="row g-3 needs-validation" @submit.prevent="loginNow" novalidate>
                                        <div class="col-md-12">
                                            <label for="email" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="email" v-model="email" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="pass" class="form-label">Password</label>
                                            <input type="password" class="form-control" id="pass" v-model="pass" required>
                                        </div>
                                        <div class="col-12">
                                            <button class="btn btn-primary" type="submit">Login</button>
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
    name: 'LoginPage',
    methods: {
        async loginNow() {
            const checkResponse = await fetch(`http://localhost:3000/users?email=${this.email}&&pass=${this.pass}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('email', this.email);
                this.$router.push('/'); 
            } else {
                alert('Failed to login');
                return;
            }
        }
    }
}
</script>

<style></style>
