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
                        <div class="col-md-4" v-for="user in users" :key="user.id">
                            <div class="card">
                                <h2 class="card-header">{{ user.name }}</h2>
                                <div class="card-body">
                                    <!-- <h5 class="card-title">Active Now</h5> -->
                                    <ul class="list-group mb-4 mt-4">
                                        <li class="list-group-item">Age: <b>{{ user.age }}</b></li>
                                        <li class="list-group-item">Gender: <b>{{ user.gender }}</b></li>
                                        <li class="list-group-item">Nationality: <b>{{ user.nationality }}</b></li>
                                    </ul>
                                    <div class="d-block">
                                        <RouterLink :to="`/invite/${user.id}`">
                                            <div class="btn btn-primary" style="width: 100%;">Send Message</div>
                                        </RouterLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Load More Button -->
                    <div v-if="hasMoreUsers" class="text-center mt-4">
                        <button class="btn btn-primary" @click="loadMore">Load More</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardPage',
    data() {
        return {
            users: [],
            sender: parseInt(localStorage.getItem('id')),
            page: 1,  // to keep track of the current page
            perPage: 6, // number of users per page
            hasMoreUsers: true, // flag to determine if more users are available
        };
    },
    async created() {
        await this.loadUsers();
    },
    methods: {
        async loadUsers() {
            try {
                const response = await fetch(`http://localhost:3000/users?_page=${this.page}&_limit=${this.perPage}`);
                const data = await response.json();

                if (data.length > 0) {
                    // Filter out the current sender from the list
                    const filteredUsers = data.filter(user => user.id !== this.sender);
                    this.users = [...this.users, ...filteredUsers];

                    // If the number of users returned is less than perPage, no more users are available
                    if (data.length < this.perPage) {
                        this.hasMoreUsers = false;
                    } else {
                        this.page++;
                    }
                } else {
                    console.error('User not found');
                }
            } catch (error) {
                console.error('Error loading users:', error);
            }
        },
        loadMore() {
            this.loadUsers();
        }
    }
};
</script>

<style></style>
