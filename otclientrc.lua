-- DGOT OTClient

Servers_init = {
    ["http://2.24.72.76:11000/login.php"] = {
        port = 22000,
        protocol = 1500,
        httpLogin = true,
        useAuthenticator = false
    }
}

g_settings.set("host", "http://2.24.72.76:11000/login.php")
g_settings.set("port", 22000)
g_settings.set("client-version", 1500)
g_settings.set("httpLogin", true)

print("DGOT carregado! Login: http://2.24.72.76:11000/login.php Game: 2.24.72.76:22000")
