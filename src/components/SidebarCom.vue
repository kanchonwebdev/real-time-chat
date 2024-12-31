<template>
    <div class="card">
        <div class="card-body">
            <h1 class="card-title">Chat APP</h1>
        </div>
    </div>
    <div class="card">
        <ul class="list-group list-group-flush">
            <li class="list-group-item">
                <a href="">
                    <RouterLink to="/">Dashboard</RouterLink>
                </a>
            </li>
            <li class="list-group-item">
                <a href="">
                    <RouterLink to="/message">Messages</RouterLink>
                </a>
            </li>
            <li class="list-group-item">
                <a href="">
                    <RouterLink to="/profile">Profile</RouterLink>
                </a>
            </li>
            <li class="list-group-item">
                <a href="">
                    <RouterLink to="/update">Update Profile</RouterLink>
                </a>
            </li>
            <li class="list-group-item">
                <a href="">
                    <RouterLink to="/password">Change Password</RouterLink>
                </a>
            </li>
            <li class="list-group-item">
                <a href="">
                    <RouterLink to="/logout">Log Out</RouterLink>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "SidebarCom"
    }
</script>

<style>
</style>