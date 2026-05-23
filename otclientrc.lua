-- DGOT OTClient

Servers_init = {
    ["http://dgot.com.br/login.php"] = {
        port = 22000,
        protocol = 1500,
        httpLogin = true,
        useAuthenticator = false
    }
}

g_settings.set("host", "http://dgot.com.br/login.php")
g_settings.set("port", 22000)
g_settings.set("client-version", 1500)
g_settings.set("httpLogin", true)

print("DGOT carregado! Login: http://dgot.com.br/login.php Game: 2.24.72.76:22000")
