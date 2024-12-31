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
                                <div class="card-body">
                                    <h2 class="card-title">{{name}}</h2>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><b>Gender:</b> {{ gender }}</li>
                                    <li class="list-group-item"><b>Age:</b> {{ age }}</li>
                                    <li class="list-group-item"><b>Nationality:</b> {{ nationality }}</li>
                                    <li class="list-group-item"><b>Status:</b> <span class="bg-success pl-2 pr-2 rounded text-white">active</span></li>
                                </ul>
                                <div class="card-body">
                                    <a href="#" class="card-link btn btn-success">update</a>
                                    <a href="#" class="card-link btn btn-warning">print</a>
                                    <a href="#" class="card-link btn btn-danger">delete</a>
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
    data: function() {
        return {
            email: localStorage.getItem('email'),
            pass: '',
            name: '',
            age: '',
            nationality: '',
            gender: ''
        }
    },
    async created() {
        const checkResponse = await fetch(`http://localhost:3000/users?email=${this.email}`);
        const existingUsers = await checkResponse.json();
        if (existingUsers.length > 0) {
            const user = existingUsers[0];
            this.name = user.name;
            this.email = user.email;
            this.pass = user.pass;
            this.age = user.age;
            this.nationality = user.nationality;
            this.gender = user.gender
        } else {
            console.error('User not found');
        }
    }
}
</script>

<style></style>
