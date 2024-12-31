<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3 position-sticky">
                <!-- Sidebar Component -->
                <SidebarCom />
                <!-- Sidebar Component end -->
            </div>
            <div class="col-md-9">
                <div class="container-fluid bg-light p-4">
                    <!-- header component -->
                    <HeaderCom />
                    <!-- header component end -->
                    <div class="row g-4">
                        <div class="col-md-12">
                            <div class="card">
                                <h1 class="card-header">Change Password</h1>
                                <div class="card-body">
                                    <span>
                                        <RouterLink to="/profile" class="btn btn-primary">Profile</RouterLink>
                                    </span>
                                    &nbsp;
                                    <span>
                                        <RouterLink to="/" class="btn btn-primary">Dashboard</RouterLink>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <form class="row g-3 needs-validation" @submit.prevent="changeName" novalidate>
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
                                            <label for="age" class="form-label">Age</label>
                                            <input type="number" class="form-control" id="age" v-model="age" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="nationality" class="form-label">Nationality</label>
                                            <input type="text" class="form-control" id="nationality"
                                                v-model="nationality" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="gender" class="form-label">Gender</label>
                                            <select v-model="gender" id="gender" class="form-control">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div class="col-12">
                                            <button class="btn btn-success form-control" type="submit">
                                                Update Profile
                                            </button>
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
    name: 'UpdatePage',
    data: function () {
        return {
            name: '',
            email: localStorage.getItem('email'),
            gender: '',
            nationality: '',
            age: '',
        }
    },
    async created() {
        const checkResponse = await fetch(`http://localhost:3000/users?email=${this.email}`);
        const existingUsers = await checkResponse.json();
        if (existingUsers.length > 0) {
            const user = existingUsers[0];
            this.name = user.name;
            this.gender = user.gender;
            this.age = user.age;
            this.nationality = user.nationality;
        } else {
            console.error('User not found');
        }
    },
    methods: {
        async changeName() {
            // if (this.newPass !== this.conPass) {
            //     alert('Passwords do not match');
            //     return;
            // }

            const checkResponse = await fetch(`http://localhost:3000/users?email=${this.email}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length === 0) {
                alert('User not found');
                return;
            }

            const user = existingUsers[0];
            const response = await fetch(`http://localhost:3000/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.name,
                    email: this.email,
                    age: this.age,
                    nationality: this.nationality,
                    gender: this.gender
                })
            });

            if (response.ok) {
                alert('Prfoile changed successfully');
            } else {
                alert('Failed to change profile');
            }
        }
    }
}
</script>

<style></style>
