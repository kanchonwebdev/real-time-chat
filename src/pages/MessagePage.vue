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
                                    <h5 v-if="receiverDetails">Receiver: {{ receiverDetails.name }} (Age:{{
                                        receiverDetails.age }})</h5>
                                    <div style="overflow-y: auto; overflow-x:hidden; height: 350px;"
                                        ref="messageContainer">
                                        <div class="row mb-4" v-for="m in msg" :key="m.id">
                                            <div class="col-md-12" v-if="m.sender !== sender">
                                                <div class="bg-warning p-4"
                                                    style="border-radius: 50px; border-bottom-left-radius: unset;">
                                                    <p class="text-white" style="margin: unset;">
                                                        {{ m.message }}
                                                        <br>
                                                        <i>Receive at {{ m.date }}</i>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="col-md-12" v-else>
                                                <div class="bg-success d-flex justify-content-end p-4"
                                                    style="border-radius: 50px; border-bottom-right-radius: unset;">
                                                    <p class="text-white" style="margin: unset;text-align: right;">
                                                        {{ m.message }}
                                                        <br>
                                                        <i>Sent at {{ m.date }}</i>
                                                    </p>
                                                </div>
                                            </div>
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
import io from 'socket.io-client';

export default {
    name: 'MessagePage',
    data: function () {
        return {
            sender: parseInt(localStorage.getItem('id')),
            messageId: '',
            users: [],
            msg: [],
            message: '',
            receiverDetails: null,
            tickets: [],
            socket: null
        }
    },
    async created() {
        // Initialize Socket.IO
        this.socket = io('http://localhost:5000');

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        this.socket.on('receiveMessage', (newMessage) => {
            if (newMessage.msg_id === this.messageId) {
                this.msg.push(newMessage);
                this.$nextTick(() => {
                    const container = this.$refs.messageContainer;
                    container.scrollTop = container.scrollHeight;
                });
            }
        });

        const senderRes = await fetch(`http://localhost:3000/tickets?sender=${this.sender}`);
        let senderInfo = await senderRes.json();

        if (senderInfo && senderInfo.length > 0) {
            senderInfo = senderInfo.map(ticket => ({
                ...ticket,
                id: ticket.receiver
            }));
            this.tickets.push(...senderInfo);
        }

        const receiverRes = await fetch(`http://localhost:3000/tickets?receiver=${this.sender}`);
        let receiverInfo = await receiverRes.json();

        if (receiverInfo && receiverInfo.length > 0) {
            receiverInfo = receiverInfo.map(ticket => ({
                ...ticket,
                id: ticket.sender
            }));
            this.tickets.push(...receiverInfo);
        }

        const ticketIds = [...new Set(this.tickets.map(u => u.id))];
        const userResponse = await fetch(`http://localhost:3000/users?id=${ticketIds.join('&id=')}`);
        let users = await userResponse.json();

        this.users = users.map(user => {
            const matchingTicket = this.tickets.find(ticket => ticket.id === user.id);
            return {
                ...user,
                msg_id: matchingTicket ? matchingTicket.msg_id : null
            };
        });

        const routeMsgId = this.$route.params.id;
        if (routeMsgId) {
            this.messageId = routeMsgId;
            const receiver = this.users.find(user => user.msg_id === this.messageId);
            if (receiver) {
                this.receiverDetails = receiver;
            }
        }
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            async handler(newId) {
                this.messageId = newId || '';
                if (this.messageId) {
                    const response = await fetch(`http://localhost:3000/messages?msg_id=${this.messageId}`);
                    this.msg = await response.json();

                    const receiver = this.users.find(user => user.msg_id === this.messageId);
                    if (receiver) {
                        this.receiverDetails = receiver;
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

            // save message to the server
            await fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage)
            });

            // Emit message via Socket.IO
            this.socket.emit('sendMessage', newMessage);
            console.log(this.msg);
            

            // Push message locally
            // this.msg.push(newMessage);
            this.message = '';
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                container.scrollTop = container.scrollHeight;
            });
        }
    },
    beforeUnmount() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
</script>

<style></style>
