
export function setConnected() {
    localStorage.setItem("CONNECTED", "true");
}

export function isConnected() : boolean {
    const connected = localStorage.getItem("CONNECTED")
    if (connected && connected.length > 0) {
        return true
    }
    return false
}
export function logout() {
    localStorage.removeItem("CONNECTED");
}