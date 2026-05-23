-- DGOT OTClient

Servers_init = {
    ["http://2.24.72.76:8080/login.php"] = {
        port = 7172,
        protocol = 1500,
        httpLogin = true,
        useAuthenticator = false
    }
}

g_settings.set("host", "http://2.24.72.76:8080/login.php")
g_settings.set("port", 7172)
g_settings.set("client-version", 1500)
g_settings.set("httpLogin", true)

print("DGOT carregado! Login: http://2.24.72.76:8080/login.php Game: 2.24.72.76:7172")
