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
                                    <form class="row g-3 needs-validation" @submit.prevent="changePassword" novalidate>
                                        <div class="col-md-4">
                                            <label for="type" class="form-label">Old Password</label>
                                            <input type="password" class="form-control" id="type" v-model="oldPass"
                                                required>
                                        </div>
                                        <div class="col-md-4">
                                            <label for="type" class="form-label">New Password</label>
                                            <input type="password" class="form-control" id="type" v-model="newPass"
                                                required>
                                        </div>
                                        <div class="col-md-4">
                                            <label for="type" class="form-label">Confirm Password</label>
                                            <input type="password" class="form-control" id="type" v-model="conPass"
                                                required>
                                        </div>
                                        <div class="col-12">
                                            <button class="btn btn-success form-control" type="submit">
                                                Change Password
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
    name: 'ProfilePage',
    data: function () {
        return {
            email: localStorage.getItem('email'),
            oldPass: '',
            newPass: '',
            conPass: '',
        }
    },
    methods: {
        async changePassword() {
            if (this.newPass !== this.conPass) {
                alert('Passwords do not match');
                return;
            }

            const checkResponse = await fetch(`http://localhost:3000/users?email=${this.email}&pass=${this.oldPass}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length === 0) {
                alert('Old password is incorrect');
                return;
            }

            const user = existingUsers[0];
            const response = await fetch(`http://localhost:3000/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pass: this.newPass })
            });

            if (response.ok) {
                alert('Password changed successfully');
                this.oldPass = '';
                this.newPass = '';
                this.conPass = '';
            } else {
                alert('Failed to change password');
            }
        }
    }
}
</script>

<style>
</style>
