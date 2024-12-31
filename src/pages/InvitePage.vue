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
                                <h1 class="card-header">Send Message</h1>
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
                                    <form class="row g-3 needs-validation" @submit.prevent="sendMessage" novalidate>
                                        <div class="col-md-6">
                                            <label for="name" class="form-label">Full Name</label>
                                            <input type="text" class="form-control" id="name" v-model="name" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="age" class="form-label">Age</label>
                                            <input type="number" class="form-control" id="age" v-model="age" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="nationality" class="form-label">Nationality</label>
                                            <input type="text" class="form-control" id="nationality"
                                                v-model="nationality" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="gender" class="form-label">Gender</label>
                                            <select v-model="gender" id="gender" class="form-control">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="message" class="form-label">Send Message</label>
                                            <textarea v-model="message" id="message" rows="5" cols="10"
                                                class="form-control"></textarea>
                                        </div>
                                        <div class="col-12">
                                            <button class="btn btn-success form-control" type="submit">
                                                Send Message
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
    name: 'InvitePage',
    data: function () {
        return {
            name: '',
            email: localStorage.getItem('email'),
            gender: '',
            nationality: '',
            age: '',
            message: '',
            receiver: '',
            sender: parseInt(localStorage.getItem('id')),
            msg_id: crypto.randomUUID()
        }
    },
    async created() {
        const checkResponse = await fetch(`http://localhost:3000/users?id=${this.$route.params.id}`);
        const existingUsers = await checkResponse.json();
        if (existingUsers.length > 0) {
            const user = existingUsers[0];
            this.name = user.name;
            this.gender = user.gender;
            this.age = user.age;
            this.nationality = user.nationality;
            this.receiver = user.id
        } else {
            console.error('User not found');
        }
    },
    methods: {
        async sendMessage() {
            const checkResponse = await fetch(`http://localhost:3000/tickets?sender=${this.sender}&receiver=${this.receiver}`);
            const existingTickets = await checkResponse.json();
            const ticketOrgRes = existingTickets[0];

            console.log(ticketOrgRes);
            

            if (existingTickets.length === 0) {
                const ticketResponse = await fetch(`http://localhost:3000/tickets`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        msg_id: this.msg_id,
                        receiver: parseInt(this.receiver),
                        sender: this.sender,
                        date: Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
                    })
                });

                if (ticketResponse.ok) {
                    this.sendReply(this.msg_id);
                }
            } else {
                this.sendReply(ticketOrgRes.msg_id);
            }
        },
        async sendReply(msg_id) {
            const response = await fetch(`http://localhost:3000/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    msg_id: msg_id,
                    message: this.message,
                    receiver: parseInt(this.receiver),
                    sender: this.sender,
                    date: Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
                })
            });


            if (response.ok) {
                alert('Message send successfully');
            } else {
                alert('Failed to send message');
            }
        }
    }
}
</script>

<style></style>
