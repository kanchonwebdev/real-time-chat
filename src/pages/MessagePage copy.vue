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
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <div style="overflow-y: auto; overflow-x:hidden; height: 600px;">
                                        <ul class="list-group" v-for="user in users" :key="user.id">
                                            <li class="list-group-item">
                                                <RouterLink :to="`/message/${user.msg_id}`">
                                                    {{ user.name }} - Age({{ user.age }})
                                                </RouterLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="card">
                                <div class="card-body">
                                    <h5 v-if="receiverDetails">Receiver: {{ receiverDetails.name }} (Age:{{ receiverDetails.age }})</h5>
                                    <div style="overflow-y: auto; overflow-x:hidden; height: 350px;"
                                        ref="messageContainer">
                                        <div class="row mb-4" v-for="m in msg" :key="m.id">
                                            <div class="col-md-12">
                                                <div class="bg-success p-2 mb-2">
                                                    <p class="text text-white" style="margin: unset;">
                                                        {{ m.message }}
                                                        <!-- <br>
                                                        <i>Receiver</i> -->
                                                    </p>
                                                </div>
                                            </div>
                                            <!-- <div class="col-md-12" else>
                                                <div class="bg-warning d-flex justify-content-end p-2 mt-2">
                                                    <p class="text text-white" style="margin: unset;">
                                                        {{ m.message }}
                                                        <br>
                                                        <i>Sender</i>
                                                    </p>
                                                </div>
                                            </div> -->
                                        </div>
                                    </div>
                                    <form v-if="messageId !== ''" class="row g-3 needs-validation"
                                        @submit.prevent="sendMessage" novalidate>
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
    name: 'MessagePage',
    data: function () {
        return {
            sender: parseInt(localStorage.getItem('id')),
            messageId: '',
            users: [],
            msg: [],
            message: '',
            receiverDetails: null
        }
    },
    async created() {
        const ticketResponse = await fetch(`http://localhost:3000/tickets`);
        const tickets = await ticketResponse.json();

        const userIds = new Set(
            tickets.filter(ticket => ticket.sender === this.sender || ticket.receiver === this.sender)
                .map(ticket => ticket.receiver)
                .concat(tickets.filter(ticket => ticket.sender === this.sender || ticket.receiver === this.sender)
                    .map(ticket => ticket.sender))
        );

        const userResponse = await fetch(`http://localhost:3000/users?id=${[...userIds].join('&id=')}`);
        const users = await userResponse.json();

        this.users = users.map(user => {
            const userTickets = tickets.filter(ticket => ticket.receiver === user.id || ticket.sender === user.id);
            return {
                ...user,
                msg_id: userTickets.length > 0 ? userTickets[0].msg_id : null
            };
        });

        console.log(this.users);
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            async handler(newId) {
                this.messageId = newId || '';
                if (this.messageId) {
                    const response = await fetch(`http://localhost:3000/messages?msg_id=${this.messageId}`);
                    this.msg = await response.json();

                    const receiverId = this.msg.length > 0 ? this.msg[0].receiver : null;
                    if (receiverId) {
                        const receiverResponse = await fetch(`http://localhost:3000/users?id=${receiverId}`);
                        const receiverData = await receiverResponse.json();
                        if (receiverData.length > 0) {
                            this.receiverDetails = receiverData[0];
                        }
                    }

                    this.$nextTick(() => {
                        const container = this.$refs.messageContainer;
                        container.scrollTop = container.scrollHeight;
                    });
                }
            }
        }
    },
    methods: {
        async sendMessage() {
            if (this.message.trim() === '') return;

            const newMessage = {
                msg_id: this.messageId,
                message: this.message,
                receiver: this.users.find(u => u.msg_id === this.messageId)?.receiver || '',
                sender: this.sender,
                date: new Date().toISOString(),
                id: Date.now()
            };

            await fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage)
            });

            this.msg.push(newMessage);
            this.message = '';
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                container.scrollTop = container.scrollHeight;
            });
        }
    }
}
</script>

<style></style>
